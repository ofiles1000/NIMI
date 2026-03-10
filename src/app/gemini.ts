import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class Gemini {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an expert educational content creator for NIMI (National Instructional Media Institute), specializing in vocational training for ITIs in India."
        }
      });
      return response.text || "No content generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating content. Please check your API key and try again.";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateJson<T>(prompt: string, schema: any, systemInstruction?: string): Promise<T | null> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an expert educational content creator for NIMI. Return only valid JSON.",
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return JSON.parse(response.text || "null") as T;
    } catch (error) {
      console.error("Gemini JSON Error:", error);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateImage(prompt: string, config?: any): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: config || { aspectRatio: "1:1" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return null;
    }
  }

  async generateVideo(prompt: string): Promise<string | null> {
    try {
      let operation = await this.ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await this.ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) return null;

      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: { 'x-goog-api-key': GEMINI_API_KEY },
      });
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Gemini Video Error:", error);
      return null;
    }
  }
}
