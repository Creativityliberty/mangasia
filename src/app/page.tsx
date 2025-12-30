
"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

            {/* Immersive Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950 z-10" />
                    {/* Using the generated hero image (referencing by public path - assumes we move it to public or import) 
                 For now, we use a placeholder or the actual generated file if accessible. 
                 Since I cannot move files to public easily without command, I will use an Unsplash fallback that matches the vibe for the demo code 
                 BUT I will assume the generated image is available at /hero-bg.png for the "dream" implementation.
                 Let's use a high-quality external URL to guarantee it looks good right now.
             */}
                    <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop"
                        alt="Neo Tokyo Cyberpunk"
                        className="w-full h-full object-cover object-center scale-110"
                    />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full border border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-bold tracking-widest uppercase text-xs mb-6 backdrop-blur-md">
                            AI-Powered Manga Studio
                        </span>

                        <h1 className="text-7xl md:text-9xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-2xl mb-8">
                            MANGASIA
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                            Craft your saga with <span className="text-emerald-400 font-bold">Gemini 3</span> & <span className="text-purple-400 font-bold">Imagen 4</span>.
                            From zero to published manga in minutes.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Link href="/login" className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105">
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                            </Link>

                            <button className="px-8 py-4 text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                Watch Trailer
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-32 px-6 relative z-10 bg-slate-950">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8 text-indigo-400" />}
                        title="Contextual AI Co-Pilot"
                        description="Gemini 3 remembers your characters, plot, and tone across every step."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-emerald-400" />}
                        title="Flash Generation"
                        description="Generate full storyboards and dialogues in seconds with zero latency."
                    />
                    <FeatureCard
                        icon={<Globe className="w-8 h-8 text-purple-400" />}
                        title="Global Publishing"
                        description="Export to PDF, Webtoon format, or publish directly to our community."
                    />
                </div>
            </section>

        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    )
}
