
"use client";

import React from 'react';
import { Project, STEPS } from '@/types';
import { CheckCircle2, Circle, X, Trophy } from 'lucide-react';
import * as motion from "framer-motion/client";

interface Props {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onNavigateToStep: (stepId: string) => void;
}

export default function Checklist({ project, isOpen, onClose, onNavigateToStep }: Props) {
    if (!isOpen) return null;

    const getStepStatus = (stepId: string) => {
        // Basic check: is the field not empty?
        // In a real app we might have more complex validation
        // Mapping stepIds to scenario keys
        const s = project.scenario;
        const mapping: Record<string, string> = {
            'characters': s.charactersText,
            'theme': s.theme,
            'tone': s.tone,
            'universe': s.universe,
            'ideas': s.ideas,
            'plan': s.generalPlan,
            'beats': s.keyEvents,
            'development': s.detailedPlot,
            'dialogue': s.dialogues,
            'storyboard': s.script, // Assuming script is the output of step 10
            'cover': s.coverDescription
        };
        return !!mapping[stepId];
    };

    const completedCount = STEPS.filter(s => getStepStatus(s.id)).length;
    const progress = Math.round((completedCount / STEPS.length) * 100);

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col"
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-white font-comic tracking-wider flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        MISSION LOG
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs mb-2 text-slate-400 font-bold uppercase tracking-wider">
                        <span>Completion</span>
                        <span className="text-indigo-400">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, type: "spring" }}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {STEPS.map((step) => {
                        const isDone = getStepStatus(step.id);
                        return (
                            <div
                                key={step.id}
                                onClick={() => onNavigateToStep(step.id)}
                                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all group ${isDone
                                        ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                                        : 'border-slate-800 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800'
                                    }`}
                            >
                                {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors shrink-0" />
                                )}
                                <div>
                                    <h4 className={`text-sm font-bold ${isDone ? 'text-emerald-200' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`}>
                                        {step.label}
                                    </h4>
                                    {!isDone && <p className="text-[10px] text-indigo-400 mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Tap to start</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 italic">
                        "A true Mangaka never skips the storyboard phase."
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
