
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Language, DietStyle, ArgentineRegion } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const safeJsonParse = (str: string | undefined, fallback: any) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str.trim());
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return fallback;
  }
};

export const geminiService = {
  // Analyze physique from images using Gemini 3 Pro for high-quality assessment
  async analyzePhysique(images64: string[], goal: string, dietStyle: DietStyle, region: ArgentineRegion, language: Language) {
    const imageParts = images64.map(img => ({
      inlineData: { data: img, mimeType: 'image/jpeg' }
    }));

    const prompt = `Actúa como un preparador físico de élite y nutricionista experto. Analiza estas fotos para alguien principiante.
    Objetivo: ${goal}
    Dieta: ${dietStyle}
    Región: ${region} (Enfócate en Argentina si aplica).
    Idioma de respuesta: ${language}.
    Muestra tu análisis de forma motivadora y humana.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [...imageParts, { text: prompt }]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              assessment: { type: Type.STRING },
              estimatedBodyFat: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              beginnerTips: { type: Type.STRING },
              postureCorrection: { type: Type.STRING },
              aestheticExercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    sets: { type: Type.STRING },
                    focus: { type: Type.STRING }
                  },
                  required: ["name", "reason", "sets", "focus"]
                }
              },
              suggestedDiet: {
                type: Type.OBJECT,
                properties: {
                  breakfast: { type: Type.STRING },
                  lunch: { type: Type.STRING },
                  snack: { type: Type.STRING },
                  dinner: { type: Type.STRING },
                  regionalNotes: { type: Type.STRING }
                },
                required: ["breakfast", "lunch", "snack", "dinner", "regionalNotes"]
              }
            },
            required: ["assessment", "estimatedBodyFat", "strengths", "focusAreas", "beginnerTips", "aestheticExercises", "suggestedDiet", "postureCorrection"]
          }
        }
      });
      // response.text is a property, not a method
      return safeJsonParse(response.text, {});
    } catch (err) {
      console.error(err);
      return {};
    }
  },

  // Analyze supplement bottles using Gemini 3 Flash
  async analyzeSupplementKit(image64: string, profile: UserProfile | null) {
    const context = profile 
      ? `Explica a ${profile.name} cómo tomarlos y si son lógicos para su objetivo de ${profile.goal}. Idioma: ${profile.language}.`
      : `Explica qué son estos suplementos y cómo se toman de forma segura. Idioma: Español.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: image64, mimeType: 'image/jpeg' } },
            { text: `Identifica estos suplementos. ${context} Responde en JSON.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              supplements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    howToTake: { type: Type.STRING },
                    isSmartForYou: { type: Type.BOOLEAN },
                    logic: { type: Type.STRING }
                  },
                  required: ["name", "howToTake", "isSmartForYou", "logic"]
                }
              },
              overallWarning: { type: Type.STRING }
            },
            required: ["supplements", "overallWarning"]
          }
        }
      });
      return safeJsonParse(response.text, { supplements: [], overallWarning: "No se pudo realizar el análisis." });
    } catch (err) {
      return { supplements: [], overallWarning: "Error de conexión con la IA." };
    }
  },

  // Interactive chat with a coach persona
  async chatWithCoach(message: string, history: any[], profile: UserProfile) {
    const systemPrompt = `Eres un Coach Humano de Nutri-Coach Pro. Usuario: ${profile.name}. Objetivo: ${profile.goal}. Idioma: ${profile.language}. Responde de forma motivadora y directa.`;
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: systemPrompt }
      });
      const result = await chat.sendMessage({ message });
      return result.text || "Lo siento, tuve un problema procesando tu mensaje.";
    } catch (err) {
      return "No puedo responder en este momento.";
    }
  },

  // Generate a customized supplement protocol based on profile
  async generateProtocol(profile: UserProfile) {
    const prompt = `Genera un protocolo de suplementos para ${profile.name} (${profile.goal}). Idioma: ${profile.language}. JSON array de objetos.`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dose: { type: Type.STRING },
                timing: { type: Type.STRING },
                mechanism: { type: Type.STRING },
                evidenceLevel: { type: Type.STRING }
              },
              required: ["name", "dose", "timing", "mechanism", "evidenceLevel"]
            }
          }
        }
      });
      return safeJsonParse(response.text, []);
    } catch (err) {
      return [];
    }
  },

  // Fix: Missing verifyDocument method required by AdminVerification.tsx
  async verifyDocument(base64: string, mimeType: string) {
    const prompt = `Analiza este documento científico o etiqueta de suplemento para verificar la evidencia. Extrae la información en JSON.`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              year: { type: Type.STRING },
              evidenceLevel: { type: Type.STRING, description: 'A, B, C, or D' },
              summary: { type: Type.STRING },
              claims: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "source", "year", "evidenceLevel", "summary", "claims"]
          }
        }
      });
      return safeJsonParse(response.text, null);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};
