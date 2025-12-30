
"use client";

import React, { useState } from 'react';
import ScenarioWizard from '@/components/ScenarioWizard';
import MangaBoard from '@/components/MangaBoard';
import { Project } from '@/types';

// Initial Mock State
const INITIAL_PROJECT: Project = {
  id: 'proj_demo',
  updatedAt: Date.now(),
  currentStep: 'universe',
  scenario: {
    title: "",
    chapterNumber: 1,
    previousSynopsis: "",
    charactersText: "",
    theme: "",
    tone: "",
    universe: "",
    ideas: "",
    generalPlan: "",
    keyEvents: "",
    detailedPlot: "",
    dialogues: "",
    script: "", // Final output
    coverDescription: ""
  },
  pages: [
    {
      id: 'page_1',
      inkMode: 'monochrome',
      panels: [
        { id: 'p1', order: 1, description: "A vast cyberpunk city under rain", bubbles: [], imageUrl: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80&w=1000" },
        { id: 'p2', order: 2, description: "Hero looking at the neon signs", bubbles: [{ id: 'b1', text: "Where are they hiding?", type: 'thought', x: 50, y: 50 }], imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000" },
        { id: 'p3', order: 3, description: "Close up on robotic eye", bubbles: [], imageUrl: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1000" },
      ]
    }
  ]
};

export default function Home() {
  const [view, setView] = useState<'wizard' | 'board'>('wizard');
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);

  return (
    <main className="h-screen w-full bg-slate-950 overflow-hidden">
      {view === 'wizard' ? (
        <ScenarioWizard
          project={project}
          onUpdate={setProject}
          onNext={() => setView('board')}
        />
      ) : (
        <MangaBoard
          project={project}
          onUpdate={setProject}
          onBack={() => setView('wizard')}
        />
      )}
    </main>
  );
}
