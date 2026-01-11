
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeImageForFunction(base64Image: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-01-2025",
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/png", data: base64Image } },
            { text: "Extract the multivariable function (f(x,y)) from this image. Only return the expression string, nothing else." }
          ]
        }
      ]
    });
    return response.text?.trim() || "x^2 + y^2";
  } catch (error) {
    console.error("OCR Error:", error);
    return "x^2 + y^2";
  }
}

export async function getChefExplanation(topic: string, expression: string, result: any): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a friendly, cute Math Chef at the MatchaBerry Cafe. 
      Topic: ${topic}
      Recipe (Function): ${expression}
      Measured Results: ${JSON.stringify(result)}
      
      Format the output using these exact sections for maximum clarity:
      
      <h4>🍓 Daily Special</h4>
      Brief, cute 1-sentence summary of what we found.
      
      <h4>🍵 The Ingredients</h4>
      Explain the mathematical values in 2 simple bullet points. Use <b>bold</b> for the numbers.
      
      <h4>🍰 Chef's Secret</h4>
      One final takeaway about the slope or direction.
      
      Keep it professional but adorable. Use cafe metaphors. Avoid long paragraphs.`,
    });
    return response.text || "Fresh results incoming!";
  } catch (error) {
    return "A perfectly balanced mathematical treat.";
  }
}
