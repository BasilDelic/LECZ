
import { GoogleGenAI, Type } from "@google/genai";

/**
 * AI Fraud Detection Service
 */
export const auditArenaTransaction = async (
  userId: string,
  amount: number,
  description: string,
  balance: number
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `AUDIT REQUEST:
    User ID: ${userId}
    Current Balance: $${balance}
    Transaction: $${amount}
    Description: ${description}
    
    You are the Arena Secure Sentinel. Evaluate if this transaction seems fraudulent or high-risk based on standard B2B platform behavior.
    Return a JSON:
    - "isSafe": boolean
    - "riskLevel": "LOW" | "MEDIUM" | "HIGH"
    - "reason": "Explanation of decision"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isSafe: { type: Type.BOOLEAN },
          riskLevel: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["isSafe", "riskLevel", "reason"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const negotiateBulkPrice = async (
  productName: string, 
  originalPrice: number, 
  userOffer: number, 
  quantity: number,
  history: any[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert B2B Sales Negotiator for ${productName}.
    Original Price: $${originalPrice}.
    User wants to buy ${quantity} units.
    User's latest offer: $${userOffer} per unit.
    
    Conversation History: ${JSON.stringify(history)}

    Rules:
    1. If quantity is > 100, you can drop price up to 15%.
    2. If quantity is > 500, you can drop price up to 25%.
    3. Be professional, firm but encouraging. 
    
    Return a JSON response with:
    - "decision": "ACCEPTED" | "COUNTER" | "REJECTED"
    - "counterPrice": number
    - "message": "A short, persuasive sales message"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          counterPrice: { type: Type.NUMBER },
          message: { type: Type.STRING }
        },
        required: ["decision", "counterPrice", "message"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const negotiateShipping = async (
  productName: string,
  totalWeightEstimate: string,
  destination: string,
  proposedPrice: number,
  history: any[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Negotiate shipping for ${productName} going to ${destination}.
    Estimated logistics: ${totalWeightEstimate}.
    Proposed shipping cost: $${proposedPrice}.
    History: ${JSON.stringify(history)}
    
    You are a Logistics AI Assistant. Help mediate a fair price between the merchant and buyer.
    Provide a professional response suggesting if the price is fair based on international B2B standards or if it's too high/low.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING, description: "Professional advice on the shipping price" },
          isFair: { type: Type.BOOLEAN },
          suggestedPriceRange: { type: Type.STRING }
        },
        required: ["feedback", "isFair", "suggestedPriceRange"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateMarketingScript = async (productDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a 30-second TikTok-style marketing script for this product description: ${productDescription}. 
    Focus on business value, use hooks, and end with a call to action. 
    Format with markers like [Visual] and [Audio].`,
    config: { temperature: 0.8 },
  });
  return response.text;
};

export const generateProductMetadata = async (productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate for product "${productName}": 1. 5 conversion-focused hashtags. 2. A catchy TikTok caption. 3. 3 viral music genre suggestions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          caption: { type: Type.STRING },
          musicSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["hashtags", "caption", "musicSuggestions"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const chatAssistantReply = async (userMessage: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a helpful business sales assistant for a store. 
    Context: ${context}. 
    User asks: ${userMessage}. 
    Reply professionally and encourage the sale.`,
  });
  return response.text;
};

export const generateAdVideo = async (prompt: string, onProgress?: (msg: string) => void): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    onProgress?.("Summoning the Veo creative engine...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Premium commercial cinematography: ${prompt}. 4k hyper-realistic style, dynamic lighting, professional color grading.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });
    while (!operation.done) {
      onProgress?.("Rendering B2B cinematic vision...");
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return downloadLink ? `${downloadLink}&key=${process.env.API_KEY}` : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
