
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScenarioData } from "../types";

// Helper to get API key safely
const getApiKey = () => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) {
        console.error("No Gemini API Key found!");
        throw new Error("Missing API Key");
    }
    return key;
};

const genAI = new GoogleGenerativeAI(getApiKey());

// Helper to format context
const buildContext = (data: ScenarioData) => {
    return `
    --- MANGA BIBLE / CONTEXT ---
    TITLE: ${data.title} (Chapter ${data.chapterNumber || 1})
    PREVIOUS STORY SO FAR: ${data.previousSynopsis || 'This is the first chapter.'}
    VISUAL STYLE: ${data.colorMode === 'color' ? 'Full Color Manga (Manhwa/Webtoon style)' : 'Black & White Traditional Manga'}
    THEME: ${data.theme || 'Not defined yet'}
    TONE: ${data.tone || 'Not defined yet'}
    UNIVERSE: ${data.universe || 'Not defined yet'}
    CHARACTERS: ${data.charactersText || 'Not defined yet'}
    IDEAS/INSPIRATION: ${data.ideas || 'N/A'}
    GENERAL PLAN: ${data.generalPlan || 'N/A'}
    KEY EVENTS: ${data.keyEvents || 'N/A'}
    DETAILED PLOT: ${data.detailedPlot || 'N/A'}
    EXISTING DIALOGUES: ${data.dialogues || 'N/A'}
    STORYBOARD SCRIPT: ${data.script || 'N/A'}
    COVER & TITLE IDEAS: ${data.coverDescription || 'N/A'}
    -----------------------------
  `;
};

// Helper for strict character consistency in images
const buildCharacterVisualContext = (data: ScenarioData) => {
    return `
    ================================================================================
    *** CHARACTER REFERENCE SHEET (STRICT ADHERENCE REQUIRED) ***
    ================================================================================
    The following are the OFFICIAL VISUAL DESIGNS for the characters.
    You must NOT deviate from these descriptions.
    
    ${data.charactersText || 'No specific characters defined in this project.'}
    
    CRITICAL INSTRUCTIONS:
    1. If the prompt mentions a character name listed above, you MUST draw them EXACTLY as described.
    2. Pay extreme attention to: HAIR STYLE, HAIR COLOR, EYE SHAPE, CLOTHING, SCARS/TATTOOS.
    3. Do not hallucinate new features. If the description says "short black hair", do not draw long hair.
    4. Maintain the same "actor" appearance across different panels.
    ================================================================================
  `;
};

// NEW: Analyze uploaded image to get a text description for consistency
export const analyzeCharacterReference = async (
    base64Image: string,
    characterName: string
): Promise<string> => {
    try {
        const prompt = `
      Analyze this image of a character named "${characterName}".
      Provide a highly detailed visual description that I can use as a prompt for an AI image generator to recreate this exact character.
      
      Focus on:
      1. Physical traits (Hair color/style, eye shape, skin tone, build).
      2. Clothing details (colors, specific items, accessories).
      3. Distinctive features (scars, tattoos, jewelry).
      
      Format the output as a concise paragraph: "${characterName} is a..."
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Use flash-exp for vision speed

        // Extract base64 (remove data:image/png;base64, prefix if present)
        const base64Data = base64Image.split(',')[1] || base64Image;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/png" } }
        ]);

        return result.response.text();
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        return "";
    }
};

// 1. Text Generation
export const generateScenarioSuggestion = async (
    stepLabel: string,
    scenarioData: ScenarioData
): Promise<string> => {
    try {
        const prompt = `
      You are an expert manga editor (Mangaka assistant).
      
      ${buildContext(scenarioData)}

      TASK:
      The user is currently working on the step: "${stepLabel}".
      Please generate creative, coherent, and detailed content for this specific step.
      
      CRITICAL INSTRUCTION:
      - Strictly use the "MANGA BIBLE" context provided above. 
      - If previous steps are filled, consistency is key.
      - If previous steps are empty, propose something that fits the Title/Tone.
      
      Output Guidelines:
      - If "Dialogues": Write a script format with character names.
      - If "Story-Board": Describe panels visually (Panel 1: ..., Panel 2: ...).
      - If "Personnages": Create detailed character sheets.
      
      Write directly the content. Do not say "Here is a suggestion".
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Text Error:", error);
        return "Error generating suggestion. Please check API key.";
    }
};

// 2. Chat Builder Session
export const createScenarioChat = (stepLabel: string, scenarioData: ScenarioData) => {
    const context = buildContext(scenarioData);

    const isStoryboardStep = stepLabel.includes("Story-Board");
    const isCoverStep = stepLabel.includes("Couverture");

    let specializedInstruction = `When the user asks to "Draft" or "Finalize", provide the structured content clearly so they can copy it.`;

    if (isStoryboardStep) {
        specializedInstruction = `
      CRITICAL: You are helping with STEP 10: STORYBOARDING.
      When the user asks to "Draft" or "Create panels", you MUST output the script in a specific format that separates VISUALS from TEXT.
      
      Use this format strictly:
      
      PANEL 1:
      [VISUAL]: (Detailed description of the image, angle, characters, action)
      [TEXT]: (Character Name): "Dialogue here"
      [FX]: (Sound effects like BOOM, CRASH)
      
      PANEL 2:
      ...
      
      This format is required so our parser can automatically generate the images and bubbles later.
    `;
    } else if (isCoverStep) {
        specializedInstruction = `
      CRITICAL: You are helping with STEP 11: COVER & TITLE.
      Help the user find a catchy, punchy TITLE (like One Piece chapters often have).
      Propose a visual composition for the cover page (Splash Art).
      Suggest:
      1. Main Title & Episode Title.
      2. Central Image description (Dynamic pose, focus on main character or key villain).
      3. Background details (High density like Oda).
      4. Color scheme ideas.
    `;
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-thinking-exp-01-21",
        systemInstruction: `
        You are a collaborative Manga Editor and Co-author.
        Your goal is to help the user brainstorm and write the "${stepLabel}" section of their manga.
        
        Current Manga Context:
        ${context}
        
        Guidelines:
        1. Ask clarifying questions to understand the user's vision for this step.
        2. Propose ideas based on the existing context (Theme, Tone, Universe).
        3. Be creative, enthusiastic, and constructive.
        4. Use your Thinking Mode to deeply analyze the story coherence and character arcs.
        ${specializedInstruction}
      `
    });

    return model.startChat({});
};

// 3. Image Generation
// MOCK IMPLEMENTATION WARNING: REAL IMAGEN 4 NOT AVAILABLE VIA PUBLIC API YET IN SAME SDK
// WE WILL USE DYNAMIC PLACEHOLDERS FOR DEMO, OR A DIFFERENT ENDPOINT IF PROVIDED
export const generatePanelImage = async (
    panelDescription: string,
    scenarioData: ScenarioData,
    previousPanelDescription?: string
): Promise<string | null> => {
    // In a real production deployment, this would call the Imagen 4 endpoint.
    // Since we are mocking for the demo (as per instructions to set up integration points), we return a specialized placeholder.
    // However, the prompt construction logic is REAL and ready for the switch.

    const isColor = scenarioData.colorMode === 'color';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const finalPrompt = `
      ROLE: Manga Artist.
      CONTEXT: ${scenarioData.universe} | ${scenarioData.tone}
      CHARACTERS: ${scenarioData.charactersText}
      PREV PANEL: ${previousPanelDescription || 'None'}
      SCENE: ${panelDescription}
      STYLE: ${isColor ? 'Full Color Anime' : 'Black and White Manga, High Contrast, Screentones'}
      DENSITY: High detail, background characters, debris.
    `;

    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));

    // Return a dynamic placeholder that visually represents the prompt "idea"
    // Using a reliable placeholder service with tags might be better, but standard is unsplash for now
    const keywords = panelDescription.split(' ').slice(0, 3).join(',');
    return `https://source.unsplash.com/random/1024x1024/?anime,cyberpunk,${keywords}&sig=${Date.now()}`;
};

// 4. Full Page Layout Generation
export const generatePageLayout = async (scenarioData: ScenarioData): Promise<any[]> => {
    try {
        const sourceMaterial = scenarioData.script && scenarioData.script.length > 50
            ? `SOURCE SCRIPT (Use this EXACTLY to create panels): \n${scenarioData.script}`
            : `SOURCE PLOT (Create a new sequence based on this): \n${scenarioData.detailedPlot}`;

        const prompt = `
      ROLE: You are a professional Manga Layout Engine.
      
      ${buildContext(scenarioData)}

      ${sourceMaterial}

      TASK:
      Convert the provided SOURCE material into a structured JSON array of panels.
      
      CRITICAL:
      In the 'description' field, DO NOT just write "Kenzo stands there". 
      WRITE: "Kenzo, a tall man with spiky red hair and a scar on his cheek, stands there looking ominous. Detailed background of a cluttered cyberpunk street."
      You MUST inject the visual traits of the characters AND THE ENVIRONMENT into every single panel description.
      
      OUTPUT FORMAT:
      Strictly JSON array of objects.
      
      [
        {
          "description": "Detailed visual prompt...",
          "bubbles": [
            { "text": "Hello world", "type": "speech" }
          ]
        },
        ...
      ]
    `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: { responseMimeType: 'application/json' }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text() || "[]";
        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Layout Error:", error);
        return [];
    }
};

// 5. Full Chapter Generation
export const generateFullChapter = async (scenarioData: ScenarioData): Promise<any[]> => {
    try {
        const sourceMaterial = scenarioData.script && scenarioData.script.length > 50
            ? `SOURCE SCRIPT: \n${scenarioData.script}`
            : `SOURCE PLOT: \n${scenarioData.detailedPlot}`;

        const prompt = `
      ROLE: You are a Lead Manga Director.
      
      ${buildContext(scenarioData)}
      ${sourceMaterial}

      TASK:
      Break down the entire provided script/plot into a FULL MANGA CHAPTER Layout (Episode ${scenarioData.chapterNumber || 1}).
      
      MANDATORY STRUCTURE:
      Page 1: MUST BE THE COVER (Splash Art). Use the 'COVER & TITLE IDEAS' context. It should be a single large panel with the Title and dynamic art.
      Page 2 onwards: The actual story content.
      
      OUTPUT FORMAT:
      Strictly JSON Array of Page objects.
      [
        {
          "pageNumber": 1,
          "isCover": true,
          "panels": [ { "description": "COVER ART...", "bubbles": [...] } ]
        },
        ...
      ]
    `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-thinking-exp-01-21",
            generationConfig: { responseMimeType: 'application/json' }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text() || "[]";
        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Chapter Error:", error);
        return [];
    }
};

// 6. Summarize Episode (For Continuity)
export const summarizeEpisode = async (scenarioData: ScenarioData): Promise<string> => {
    try {
        const prompt = `
      ROLE: You are a Historian for a Manga Series.
      
      ${buildContext(scenarioData)}
      
      TASK:
      The user has just finished Chapter ${scenarioData.chapterNumber}.
      Please write a concise but comprehensive summary of what happened in this chapter (and previous ones if context implies).
      This summary will be used as the "PREVIOUS STORY SO FAR" context for Chapter ${scenarioData.chapterNumber + 1}.
      
      Focus on:
      - Major plot points progressed.
      - Character development/changes (did someone die? get a new power?).
      - Current location of the party.
      - Immediate cliffhanger/goal for the next chapter.
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent(prompt);
        return result.response.text() || "Summary unavailable.";
    } catch (error) {
        console.error("Summary Error:", error);
        return "Error generating summary.";
    }
};
