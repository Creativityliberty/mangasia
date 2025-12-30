
"use client";

import React from 'react';
import { Panel, Bubble } from '@/types';
import { motion } from "framer-motion";
import { Move, Image as ImageIcon, MessageCircle } from 'lucide-react';

interface Props {
    panel: Panel;
    onBubbleMove: (bubbleId: string, x: number, y: number) => void;
    onRegenerateImage: () => void;
}

export default function StoryPanel({ panel, onBubbleMove, onRegenerateImage }: Props) {
    // We use relative positioning for bubbles within the panel container

    return (
        <div className="relative w-full aspect-[2/3] bg-white border-2 border-black overflow-hidden group shadow-lg">

            {/* Background Image Layer */}
            {panel.imageUrl ? (
                <img
                    src={panel.imageUrl}
                    alt={`Panel ${panel.order}`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none contrast-125 grayscale-[var(--ink-grayscale)] sepia-[var(--ink-sepia)]"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-100 p-4 text-center">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-xs font-mono uppercase">Prompt Pending</p>
                    <p className="text-[10px] opacity-70 mt-2 line-clamp-3">{panel.description || "No description yet..."}</p>
                </div>
            )}

            {/* Grid Helper (visible only on hover when empty) */}
            {!panel.imageUrl && (
                <div className="absolute inset-0 border-dashed border-2 border-indigo-500/20 pointer-events-none" />
            )}

            {/* Controls Overlay (Hover) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                <button
                    onClick={onRegenerateImage}
                    className="p-2 bg-black/70 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    title="Regenerate Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Bubbles Layer */}
            {panel.bubbles.map((bubble) => (
                <DraggableBubble
                    key={bubble.id}
                    bubble={bubble}
                    onDragEnd={(x, y) => onBubbleMove(bubble.id, x, y)}
                />
            ))}

            <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-50 pointer-events-none">
                {panel.order}
            </div>
        </div>
    );
}

// Sub-component for individual bubbles
function DraggableBubble({ bubble, onDragEnd }: { bubble: Bubble, onDragEnd: (x: number, y: number) => void }) {
    const shapeClass: Record<string, string> = {
        'speech': 'rounded-[50%] rounded-br-none border-2 border-black bg-white text-black',
        'thought': 'rounded-[50%] border-2 border-dashed border-black bg-white text-slate-600',
        'shout': 'clip-path-starburst bg-red-600 text-white font-black uppercase tracking-widest border-4 border-black',
        'caption': 'rounded-none border-2 border-black bg-yellow-100 text-black font-mono shadow-[2px_2px_0px_#000]'
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: bubble.x, y: bubble.y }}
            onDragEnd={(_, info) => onDragEnd(info.point.x, info.point.y)}
            className={`absolute cursor-move p-4 min-w-[100px] text-center text-xs leading-tight select-none shadow-xl z-10 flex items-center justify-center ${shapeClass[bubble.type] || shapeClass['speech']}`}
        >
            {bubble.text}
            {/* Handle for visual cue */}
            <div className="absolute -top-1 -right-1 bg-indigo-500 w-2 h-2 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
