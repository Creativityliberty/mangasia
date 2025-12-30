
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Auth
        setTimeout(() => {
            localStorage.setItem('mangasia_user', 'true');
            router.push('/studio');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Enter the studio and continue your story.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Email</label>
                        <input type="email" placeholder="author@manga.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" required />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-white text-black font-bold py-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Studio"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-800 pt-8">
                    <p className="text-slate-400 text-sm">
                        New to Mangasia? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
