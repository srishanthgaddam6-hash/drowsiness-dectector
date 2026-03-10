import { GoogleGenAI, Modality, Type } from "@google/genai";
import { LearningStyle, LessonContent } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const generateLessonContent = async (
  topic: string,
  style: LearningStyle,
  level: string
): Promise<LessonContent> => {
  const prompt = `Generate a comprehensive Machine Learning lesson about "${topic}" for a ${level} level student. 
  The student's preferred learning style is ${style}.
  Provide:
  1. A clear textual explanation.
  2. A practical Python code snippet if applicable.
  3. A detailed breakdown of the concept.
  4. A descriptive prompt for an image generator to visualize this concept.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          code: { type: Type.STRING },
          explanation: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
        },
        required: ["text", "explanation", "visualPrompt"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateVisual = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [{ text: `Create a clean, educational diagram or illustration for: ${prompt}. Style: minimalist, professional, high-contrast.` }],
    },
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const generateAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return `data:audio/wav;base64,${base64Audio}`;
  }
  throw new Error("Failed to generate audio");
};

export const chatWithTutor = async (message: string, history: any[]) => {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are LearnSphere's AI ML Tutor. You explain complex machine learning concepts simply and provide code examples when helpful. You are encouraging and patient.",
    },
  });

  // Simple history management could be added here if needed
  const response = await chat.sendMessage({ message });
  return response.text;
};
