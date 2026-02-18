
import { GoogleGenAI } from "@google/genai";
import { ChessMatch, BJJMatch } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateInsights(chessMatches: ChessMatch[], bjjMatches: BJJMatch[]) {
  const prompt = `
    Analyze the following recent performance data and provide 3 concise bullet points for training focus.
    
    CHESS DATA (Last 5):
    ${chessMatches.slice(-5).map(m => `- ${m.result} against ${m.opponent}, Opening: ${m.opening}`).join('\n')}
    
    BJJ DATA (Last 5):
    ${bjjMatches.slice(-5).map(m => `- ${m.result} via ${m.method} (${m.subType || 'N/A'})`).join('\n')}
    
    Give specific, tactical advice. Format: Plain text bullets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to connect to AI analyst. Please check your connection.";
  }
}
