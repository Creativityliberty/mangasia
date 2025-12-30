
"use client";

import React, { useState } from 'react';
import { Project, STEPS } from '@/types';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import AiChat from './AiChat';
import Checklist from './Checklist';
import { motion } from "framer-motion";

interface Props {
    project: Project;
    onUpdate: (project: Project) => void;
    onNext: () => void; // Proceed to Visual Board
}

export default function ScenarioWizard({ project, onUpdate, onNext }: Props) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [showChecklist, setShowChecklist] = useState(false);

    const currentStep = STEPS[currentStepIndex];

    // Helper to get/set value based on current step
    const getCurrentValue = () => {
        const s = project.scenario;
        const keyMap: Record<string, string> = {
            'characters': s.charactersText,
            'theme': s.theme,
            'tone': s.tone,
            'universe': s.universe,
            'ideas': s.ideas,
            'plan': s.generalPlan,
            'beats': s.keyEvents,
            'development': s.detailedPlot,
            'dialogue': s.dialogues,
            'storyboard': s.script,
            'cover': s.coverDescription
        };
        return keyMap[currentStep.id] || "";
    };

    const updateCurrentValue = (val: string) => {
        const s = { ...project.scenario };
        const keyMap: Record<string, any> = {
            'characters': 'charactersText',
            'theme': 'theme',
            'tone': 'tone',
            'universe': 'universe',
            'ideas': 'ideas',
            'plan': 'generalPlan',
            'beats': 'keyEvents',
            'development': 'detailedPlot',
            'dialogue': 'dialogues',
            'storyboard': 'script',
            'cover': 'coverDescription'
        };
        const key = keyMap[currentStep.id];
        if (key) {
            // @ts-ignore
            s[key] = val;
            onUpdate({ ...project, scenario: s, updatedAt: Date.now() });
        }
    };

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onNext(); // All steps done
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <div className="flex h-full gap-6 p-6 max-w-[1600px] mx-auto relative overflow-hidden text-slate-100">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 -z-10" />

            {/* Left: Editor */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={currentStep.id}
                className="flex-1 flex flex-col gap-4"
            >
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-3xl font-black text-white font-comic tracking-wide uppercase">
                            <span className="text-indigo-500 mr-2 text-4xl">#{currentStepIndex + 1}</span>
                            {currentStep.label}
                        </h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Define this ingredient to unlock the next chapter.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowChecklist(true)}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 text-slate-300"
                            title="Open Mission Log"
                        >
                            <BookOpen className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative group min-h-[500px]">
                    <textarea
                        className="w-full h-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-lg leading-relaxed text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-inner transition-all selection:bg-indigo-500/30 font-sans"
                        placeholder={`Start writing your ${currentStep.label}...`}
                        value={getCurrentValue()}
                        onChange={(e) => updateCurrentValue(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-600 font-mono pointer-events-none">
                        {getCurrentValue().length} chars
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
                    <button
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex gap-2">
                        {currentStepIndex === STEPS.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                            >
                                <Sparkles className="w-4 h-4" /> Finish Scenario
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
                            >
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Right: AI Assistant */}
            <div className="w-[400px] flex flex-col pt-[88px] h-full overflow-hidden">
                <AiChat
                    stepLabel={currentStep.label}
                    scenarioData={project.scenario} // Pass live data context
                    onApplyContent={(text) => updateCurrentValue(text)}
                />
            </div>

            {/* Overlay: Checklist */}
            <Checklist
                project={project}
                isOpen={showChecklist}
                onClose={() => setShowChecklist(false)}
                onNavigateToStep={(stepId) => {
                    const idx = STEPS.findIndex(s => s.id === stepId);
                    if (idx !== -1) setCurrentStepIndex(idx);
                    setShowChecklist(false);
                }}
            />
        </div>
    );
}
