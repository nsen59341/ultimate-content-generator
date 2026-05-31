
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { ContentCardData, Platform } from "../types";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const GLOBAL_TONE_INSTRUCTION = `
CRITICAL VOICE GUIDELINES:
- Tone: Premium, executive, direct, and human. 
- AVOID AI CLICHES: Do not use words like "delve", "unlock", "comprehensive", "in today's digital landscape", "game-changer", "mastering", "unleash", or "stay tuned".
- STYLE: Use short, punchy sentences. Vary sentence length for rhythm. 
- AUTHENTICITY: Sound like a person with a strong opinion, not a generic summarizer. 
- FORMATTING: Use generous white space. No bolding every other word.
`;

export async function fetchAndAnalyzeContent(input: string): Promise<{ card: ContentCardData; impact: string; fullContent: string }> {
  const ai = getGeminiClient();
  
  const isUrl = input.startsWith('http');
  const prompt = isUrl 
    ? `Analyze the following URL: ${input}. 
       1. If it is a YouTube video, retrieve the transcript or a highly detailed summary using Google Search.
       2. If it is a blog or article, extract the core narrative and key arguments.
       3. Extract specific, high-value insights.
       
       Constraint: Your 'analysisPoints' should be a list of detailed paragraphs.`
    : `Analyze the following text: "${input}". Extract the core narrative and key arguments. Provide a list of detailed points.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: isUrl ? [{ googleSearch: {} }] : [],
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, description: "Must be 'YouTube' or 'Blog'" },
          duration: { type: Type.STRING },
          readTime: { type: Type.STRING },
          summary: { type: Type.STRING },
          impactSummary: { type: Type.STRING },
          analysisPoints: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A detailed list of the core points and arguments. Using an array prevents JSON truncation errors for long content."
          }
        },
        required: ["title", "type", "summary", "impactSummary", "analysisPoints"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      card: {
        title: data.title || "Untitled Content",
        type: (data.type === 'YouTube' ? 'YouTube' : 'Blog') as any,
        duration: data.duration,
        readTime: data.readTime,
        summary: data.summary || "No summary available."
      },
      impact: data.impactSummary || "No impact summary provided.",
      fullContent: (data.analysisPoints || []).join('\n\n')
    };
  } catch (e) {
    console.error("JSON Parsing Error in fetchAndAnalyzeContent. Partial text:", response.text?.slice(-100));
    return {
      card: {
        title: "Content Analysis",
        type: isUrl ? 'YouTube' : 'Blog',
        summary: "The structured analysis encountered a format error, but the core content is still usable for generation."
      } as any,
      impact: "High-value insights detected in the source material.",
      fullContent: input
    };
  }
}

export async function generatePlatformContent(platform: Platform, sourceContent: string): Promise<string> {
  const ai = getGeminiClient();
  
  const platformInstructions: Record<Platform, string> = {
    [Platform.LinkedIn]: "EXECUTIVE INSIGHT: Start with a disruptive hook that challenges a common industry belief. Provide 3 'golden nuggets' that are specific and actionable. Close with a thought-provoking question. No generic hashtags. 1.5x line spacing.",
    [Platform.InstagramPost]: "CAPTION: High-converting, visual-first storytelling. First line must stop the scroll. Use simple language. CTA should feel like a personal recommendation.",
    [Platform.InstagramReel]: "SCRIPT (60s): 0-3s is a hard hook. 3-50s is rapid-fire value with specific [Visual: Description] cues. 50-60s is a soft, high-trust CTA. Non-robotic language.",
    [Platform.Facebook]: "COMMUNITY TONE: Write like you're talking to a group of peers. Focus on the 'Why' behind the content. High empathy, low fluff.",
    [Platform.TweetThread]: "THREAD (5 Tweets): Tweet 1: A bold, data-backed or highly specific claim. Tweets 2-4: The core 'how-to' or logic. Tweet 5: The big takeaway + link. No emojis on every line.",
    [Platform.Email]: "NEWSLETTER: Subject line should be short and lowercase (e.g. 'the problem with x'). Body should feel like a 1-on-1 personal update. Focus on one specific transformation.",
    [Platform.Image]: "PROMPT: Create a hyper-realistic, cinematic visual prompt for Gemini Image. Focus on mood, lighting, and composition that looks professional and editorial, not like stock art.",
    [Platform.Video]: "VEO SCENE: Describe a cinematic, slow-motion sequence that captures the essence of this content. High production value instructions only."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Platform: ${platform}\nSource Content: ${sourceContent}`,
    config: {
      systemInstruction: GLOBAL_TONE_INSTRUCTION + "\n" + platformInstructions[platform]
    }
  });

  return response.text || "Failed to generate content.";
}

export async function generateImage(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Professional, editorial, cinematic photography style: ${prompt}` }] },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function generateVideo(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic high-end production: ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
