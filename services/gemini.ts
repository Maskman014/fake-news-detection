import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    credibilityScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating how credible the article is. 100 is perfectly credible.",
    },
    biasScore: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "The intensity of bias detected.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Reliable", "Questionable", "Misleading"],
      description: "The overall risk assessment of the content.",
    },
    verdict: {
      type: Type.STRING,
      description: "A one-line, clear, and blunt verdict summarizing if the article is fake or real.",
    },
    publisherContext: {
      type: Type.STRING,
      description: "Brief identification of the publisher, topic, and geopolitical context.",
    },
    mainClaims: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of the main claims and supporting arguments extracted.",
    },
    fallacies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of detected logical fallacies or unsupported claims.",
    },
    biasAnalysis: {
      type: Type.STRING,
      description: "Detailed explanation of identified political, ideological, or narrative bias.",
    },
    biasType: {
      type: Type.STRING,
      description: "Classification of bias type (e.g., Left, Right, Corporate, Sensational, Neutral).",
    },
    loadedLanguageExamples: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Examples of loaded language or framing techniques found in the text.",
    },
    reliabilityReasoning: {
      type: Type.STRING,
      description: "Explanation of source reputation and missing/unverifiable references.",
    },
    sourceQuality: {
      type: Type.STRING,
      enum: ["High", "Mixed", "Low", "Unverifiable"],
      description: "Assessment of source reputation.",
    }
  },
  required: [
    "credibilityScore",
    "biasScore",
    "riskLevel",
    "verdict",
    "publisherContext",
    "mainClaims",
    "fallacies",
    "biasAnalysis",
    "biasType",
    "loadedLanguageExamples",
    "reliabilityReasoning",
    "sourceQuality"
  ],
};

export const analyzeContent = async (url: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-pro-preview for deep reasoning capabilities required for bias/logic analysis
  const modelId = "gemini-3-pro-preview";

  const prompt = `Analyze the news article at this URL: ${url}. If you cannot access the full text, analyze the URL structure, domain reputation, and any available metadata or snippets known about this source to determine if it is fake or real news.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 }, // Allow some thinking for complex bias detection
        tools: [{ googleSearch: {} }], // Use search for URL analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model.");
    }

    try {
      return JSON.parse(text) as AnalysisResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, text);
      throw new Error("Failed to parse analysis results.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};