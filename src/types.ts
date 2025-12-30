
export interface Character {
    id: string;
    name: string;
    role: string;
    traits: string;
    appearance: string; // Crucial for AI image consistency
}

export interface Bubble {
    id: string;
    text: string;
    type: 'speech' | 'thought' | 'shout' | 'caption';
    x: number;
    y: number;
}

export interface Panel {
    id: string;
    description: string; // The prompt for the AI
    imageUrl?: string;
    bubbles: Bubble[];
    order: number;
}

export interface Page {
    id: string;
    panels: Panel[];
    inkMode: 'monochrome' | 'color';
}

export interface ScenarioData {
    title: string;
    chapterNumber: number;
    previousSynopsis: string;

    // The 11 Waypoints (Ingredients)
    charactersText: string;    // Step 1: Characters (JSON stringified or raw text)
    theme: string;             // Step 2
    tone: string;              // Step 3
    universe: string;          // Step 4
    ideas: string;             // Step 5
    generalPlan: string;       // Step 6
    keyEvents: string;         // Step 7
    detailedPlot: string;      // Step 8
    dialogues: string;         // Step 9
    script: string;            // Step 10: The final script derived from previous steps
    coverDescription: string;  // Step 11
}

export interface Project {
    id: string;
    scenario: ScenarioData;
    pages: Page[];
    updatedAt: number;
    currentStep: string; // 'universe', 'characters', etc.
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    isThinking?: boolean;
}

export const STEPS = [
    { id: 'characters', label: '1. Personnages' },
    { id: 'theme', label: '2. Thème' },
    { id: 'tone', label: '3. Ton du récit' },
    { id: 'universe', label: '4. Univers' },
    { id: 'ideas', label: '5. Idées & Inspirations' },
    { id: 'plan', label: '6. Plan Général' },
    { id: 'beats', label: '7. Temps Forts' },
    { id: 'development', label: '8. Développement' },
    { id: 'dialogue', label: '9. Dialogues' },
    { id: 'storyboard', label: '10. Story-Board' },
    { id: 'cover', label: '11. Couverture & Titre' },
];
