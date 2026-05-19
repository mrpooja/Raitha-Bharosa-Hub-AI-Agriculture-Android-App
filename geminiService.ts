import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getFarmingAdvice(params: {
  crop: string;
  weather: any;
  soil: any;
  index: number;
  language: string;
}) {
  const prompt = `
    You are a smart agriculture assistant for a farmer in India.
    Farmer is growing: ${params.crop}
    Current Suitability Index (Sowing Index): ${params.index}/100
    Weather: Temp ${params.weather.temperature.toFixed(1)}°C, Humidity ${params.weather.humidity.toFixed(1)}%, Moisture ${params.weather.moisture.toFixed(1)}%, Predicted Rainfall ${params.weather.predictedRainfall.toFixed(1)}mm
    Soil NPK: ${params.soil ? `N:${params.soil.n}, P:${params.soil.p}, K:${params.soil.k}` : 'Not tested'}
    
    Provide a concise, actionable advice for "Today" in ${params.language}.
    If the index is high (>70), encourage sowing. 
    If there is heavy rain predicted, advise delaying activity.
    If moisture is low, advise irrigation.
    Keep it under 3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini advice error:", error);
    return "Please check atmospheric conditions manually today.";
  }
}

export async function getCropHealthReport(params: {
  crop: string;
  weather: any;
  soil: any;
}) {
  const prompt = `
    Analyze the health risk for the following crop in India:
    Crop: ${params.crop}
    Weather: Temp ${params.weather.temperature.toFixed(1)}°C, Humidity ${params.weather.humidity.toFixed(1)}%, Moisture ${params.weather.moisture.toFixed(1)}%
    Soil NPK: ${params.soil ? `N:${params.soil.n}, P:${params.soil.p}, K:${params.soil.k}` : 'Not tested'}

    Return JSON with:
    - pestRisk: "Low" | "Medium" | "High"
    - pestReason: sentence
    - diseaseProb: number (0-100)
    - diseaseReason: sentence
    - nutrientStatus: string
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    const text = response.text;
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    return {
      pestRisk: "Low",
      pestReason: "Stable conditions",
      diseaseProb: 5,
      diseaseReason: "Low moisture risk",
      nutrientStatus: "Likely balanced"
    };
  }
}
