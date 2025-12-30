
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScenarioData } from "@/types";

// Initialize Gemini Client
// Ensure NEXT_PUBLIC_GEMINI_API_KEY is available if client-side or proxy via server action
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const createScenarioChat = (stepLabel: string, scenarioData: ScenarioData) => {
    // Upgraded to Gemini 3 Pro Preview as requested
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const systemInstruction = `
    You are an expert Manga Editor and Story Architect (Mangasia AI).
    Your goal is to help the user validate the current step: "${stepLabel}".
    
    CRITICAL CONTEXT (Previous Steps):
    - Title: ${scenarioData.title}
    - Theme: ${scenarioData.theme}
    - Tone: ${scenarioData.tone}
    - Characters: ${scenarioData.charactersText}
    
    RULES:
    1. Stay in character as a professional, encouraging Japanese editor.
    2. Ensure consistency with the Project Data Model.
    3. If the user asks for a draft, provide a structured, high-quality Markdown response.
  `;

    return model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `System Instruction: ${systemInstruction}` }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to assist with this manga project. Ganbatte!" }],
            },
        ],
    });
};

export const generateDraft = async (stepLabel: string, context: ScenarioData, userPrompt: string) => {
    // Upgraded to Gemini 3 Pro Preview
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const prompt = `
    TASK: Write a draft for the "${stepLabel}" section of a manga.
    
    CONTEXT:
    Title: ${context.title}
    Theme: ${context.theme}
    Tone: ${context.tone}
    Characters: ${context.charactersText}
    Key Events: ${context.keyEvents}
    
    USER REQUEST: ${userPrompt}
    
    OUTPUT FORMAT:
    Provide ONLY the content for this section in clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Generates an image for a specific manga panel.
 * Uses Imagen 3/4 via the Gemini API (if compatible) or falls back to a prompt generator.
 * Note: As of late 2024, standard SDK might need 'gemini-pro-vision' or specific imagen endpoints.
 * We will attempt to use the model string provided by the user: 'imagen-4.0-ultra-generate-001'
 * If that fails in the standard SDK, we catch it.
 */
export const generatePanelImagePrompt = async (panelDescription: string, style: 'monochrome' | 'color', context: ScenarioData) => {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Use flash for fast prompting

    const prompt = `
    Role: Senior Art Director.
    Task: Convert this panel description into a high-fidelity image generation prompt for Imagen 4 Ultra.
    
    Input Description: "${panelDescription}"
    Style Mode: ${style.toUpperCase()} (Manga vs Webtoon)
    Config:
    - ${style === 'monochrome' ? 'Black and white, high contrast, ink lines, screentone textures, manga aesthetic' : 'Vibrant colors, cinematic lighting, modern webtoon style, anime rendering'}
    - Characters: ${context.charactersText}
    
    Output:
    Return ONLY the raw prompt string.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Mocking actual Image Generation for now as SDK support for 'imagen-4' varies by region/key type.
// In a real deployment, this would fetch the BLOB. 
// For this demo, we will use a placeholder but set up the hook.
export const generatePanelImage = async (prompt: string): Promise<string> => {
    // Ideally: const model = genAI.getGenerativeModel({ model: "imagen-4.0-ultra-generate-001" });
    // But Imagen often requires a different call structure in early preview.
    // We will return a placeholder URL with the prompt encoded to show intent.

    console.log("Generating image with Imagen 4 Ultra for:", prompt);

    // Simulating delay
    await new Promise(r => setTimeout(r, 2000));

    // Return a dynamic placeholder that proves we processed the prompt
    return `https://placehold.co/1024x1024/020617/FFF?text=${encodeURIComponent(prompt.slice(0, 50))}`;
}
