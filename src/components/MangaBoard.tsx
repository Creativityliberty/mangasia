
"use client";

import React, { useState } from 'react';
import { Project } from '@/types';
import StoryPanel from './StoryPanel';
import { Palette, Download, LayoutGrid, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";
import { generatePanelImagePrompt, generatePanelImage } from '@/services/gemini.service';

interface Props {
    project: Project;
    onUpdate: (project: Project) => void;
    onBack: () => void;
}

export default function MangaBoard({ project, onUpdate, onBack }: Props) {
    const [currentPageIdx, setCurrentPageIdx] = useState(0);
    const [loadingPanel, setLoadingPanel] = useState<string | null>(null);
    const page = project.pages[currentPageIdx] || project.pages[0];

    const toggleInkMode = () => {
        const newPages = [...project.pages];
        newPages[currentPageIdx] = {
            ...page,
            inkMode: page.inkMode === 'monochrome' ? 'color' : 'monochrome'
        };
        onUpdate({ ...project, pages: newPages });
    };

    const handleUpdateBubble = (panelId: string, bubbleId: string, x: number, y: number) => {
        console.log(`Updated bubble ${bubbleId} to ${x},${y}`);
    };

    const handleRegenerateImage = async (panel: any) => {
        setLoadingPanel(panel.id);
        try {
            // 1. Generate optimized prompt
            const prompt = await generatePanelImagePrompt(panel.description, page.inkMode, project.scenario);

            // 2. Generate actual image
            const imageUrl = await generatePanelImage(prompt);

            // 3. Update State
            const newPages = [...project.pages];
            const pIdx = newPages[currentPageIdx].panels.findIndex(p => p.id === panel.id);
            if (pIdx > -1) {
                newPages[currentPageIdx].panels[pIdx] = {
                    ...newPages[currentPageIdx].panels[pIdx],
                    imageUrl,
                    description: prompt // Save the raw prompt for reference
                };
                onUpdate({ ...project, pages: newPages });
            }
        } catch (e) {
            console.error("Image Gen Error", e);
            alert("Failed to generate image. Check API Key.");
        } finally {
            setLoadingPanel(null);
        }
    };

    const inkVars = page.inkMode === 'monochrome'
        ? { '--ink-grayscale': '100%', '--ink-sepia': '0%' } as React.CSSProperties
        : { '--ink-grayscale': '0%', '--ink-sepia': '0%' } as React.CSSProperties;

    return (
        <div className="h-full flex flex-col bg-slate-950" style={inkVars}>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-slate-400 hover:text-white font-bold uppercase text-xs tracking-wider">
                        ← Back to Script
                    </button>
                    <div className="h-6 w-px bg-slate-800" />
                    <h2 className="text-white font-bold font-comic tracking-wide text-xl">{project.scenario.title || "Untitled Project"}</h2>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={toggleInkMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${page.inkMode === 'color'
                                ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                    >
                        <Palette className="w-4 h-4" />
                        {page.inkMode === 'color' ? 'Full Color' : 'B&W Ink'}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto p-12 bg-slate-950 relative">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`max-w-[1000px] mx-auto min-h-[1400px] bg-white shadow-2xl p-12 transition-all duration-700 ${page.inkMode === 'monochrome' ? 'sepia-[0.1]' : ''}`}
                >
                    {/* Dynamic Grid Layout - Simple version: 2 columns */}
                    <div className="grid grid-cols-2 gap-4 h-full content-start">
                        {page.panels.map((panel, idx) => (
                            <div
                                key={panel.id}
                                className={`${idx % 3 === 0 ? 'col-span-2 aspect-[2/1]' : 'col-span-1 aspect-[1/1]'} relative`}
                            >
                                <StoryPanel
                                    panel={panel}
                                    onBubbleMove={(bid, x, y) => handleUpdateBubble(panel.id, bid, x, y)}
                                    onRegenerateImage={() => handleRegenerateImage(panel)}
                                />
                                {loadingPanel === panel.id && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Generating...</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Panel Slot */}
                        <button className="col-span-1 aspect-[1/1] border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:text-indigo-400 transition-colors group">
                            <Plus className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-xs">Add Panel</span>
                        </button>
                    </div>

                    <div className="mt-12 text-center text-xs font-mono text-slate-400">
                        - {currentPageIdx + 1} -
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
