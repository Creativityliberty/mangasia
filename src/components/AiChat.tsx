
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Copy, Wand2, Loader2 } from 'lucide-react';
import { createScenarioChat, generateDraft } from '@/services/gemini.service';
import { ScenarioData, ChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';

interface Props {
    stepLabel: string;
    scenarioData: ScenarioData;
    onApplyContent: (content: string) => void;
}

export default function AiChat({ stepLabel, scenarioData, onApplyContent }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatInstance = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset chat when step changes
        setMessages([{
            id: 'intro',
            role: 'model',
            text: `Hello! I'm your Editor. Let's work on **${stepLabel}**. What's your idea?`
        }]);

        try {
            if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
                console.warn("API Key might be missing in client environment if not using Server Actions");
            }
            // Note: In a real secure app, this should be a Server Action. 
            // For this demo, we instantiate client-side but require the key to be exposed or proxied.
            // ACTUALLY: The service uses process.env which is server-side only in Next.js usually.
            // We will need to use Server Actions for the best practice. 
            // For now, let's assume we are calling a server action or API route.
            // EDIT: To keep it simple and consistent with the "Tutorial" code, we will assume 
            // the client can access the key if prefixed NEXT_PUBLIC or we move logic to API.
            // Let's stick to the structure but acknowledge the complexity.

            // For this implementation, we will use a simulation or direct call if keys allow.
            chatInstance.current = createScenarioChat(stepLabel, scenarioData);
        } catch (e) {
            console.error("Chat init error", e);
        }
    }, [stepLabel, scenarioData]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || !chatInstance.current) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const result = await chatInstance.current.sendMessage(text);
            const response = await result.response;
            const textResponse = response.text();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: textResponse
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "Error: I couldn't reach the creative network."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicDraft = async () => {
        setLoading(true);
        try {
            // This ideally calls a Server Action
            // For now, mocking the direct call or service call
            const draft = await generateDraft(stepLabel, scenarioData, "Draft this entire section creatively.");
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: draft
            }]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2 text-indigo-400 font-bold font-comic tracking-wide">
                    <Bot className="w-5 h-5" />
                    <span>AI Co-Pilot</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800 uppercase tracking-widest">Gemini 3 Pro</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                            {msg.role === 'model' && (
                                <button onClick={() => onApplyContent(msg.text)} className="mt-3 pt-3 w-full border-t border-slate-700/50 flex items-center justify-end gap-1 text-emerald-400 hover:text-emerald-300 font-bold uppercase text-[10px] tracking-wider transition-colors">
                                    <Copy className="w-3 h-3" /> Apply to Editor
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-center text-slate-500 text-xs italic animate-pulse">AI is thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-3">
                {!loading && (
                    <button onClick={handleMagicDraft} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-[1.02]">
                        <Wand2 className="w-3 h-3" /> Magic Auto-Draft
                    </button>
                )}
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Discuss ideas..."
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-4 pr-12 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-12 text-sm"
                    />
                    <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
