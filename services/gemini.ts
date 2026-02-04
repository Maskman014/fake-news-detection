import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, GroundingSource } from "../types";

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
      description: "Explanation of why the verdict was reached, citing specific search findings.",
    },
    sourceQuality: {
      type: Type.STRING,
      enum: ["High", "Mixed", "Low", "Unverifiable"],
      description: "Assessment of source verification quality.",
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
  
  const modelId = "gemini-3-pro-preview";

  const prompt = `AUDIT REQUEST: Verify the truthfulness of this article: ${url}
  
  MANDATORY SEARCH TASKS:
  1. Search for: "[Article Headline] fact check"
  2. Search for: "[Main Claim] debunked"
  3. Search for: "Is [URL Domain] a reliable source?"
  4. Find at least two independent sources (like AP, Reuters, or specialized fact-checkers) that confirm or deny these claims.
  
  Do not summarize the article. CHALLENGE it. If the official source is the ONLY one reporting it, mark it as Questionable.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 4096 }, // Increased thinking budget for deeper reasoning
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model.");
    }

    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          groundingSources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || "External Source"
          });
        }
      });
    }

    const uniqueSources = Array.from(new Set(groundingSources.map(s => s.uri)))
      .map(uri => groundingSources.find(s => s.uri === uri)!);

    try {
      const parsed = JSON.parse(text) as AnalysisResult;
      return {
        ...parsed,
        groundingSources: uniqueSources
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, text);
      throw new Error("Analysis failed. The model returned invalid data.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};