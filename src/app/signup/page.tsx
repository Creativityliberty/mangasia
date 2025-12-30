
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            localStorage.setItem('mangasia_user', 'true');
            router.push('/studio');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">Start Your Saga</h2>
                    <p className="text-slate-400 text-sm">Join the next generation of manga creators.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">First Name</label>
                            <input type="text" placeholder="Akira" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Last Name</label>
                            <input type="text" placeholder="Toriyama" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Email</label>
                        <input type="email" placeholder="author@manga.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-800 pt-8">
                    <p className="text-slate-400 text-sm">
                        Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
