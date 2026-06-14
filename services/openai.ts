import OpenAI from "openai";
import { ContentCardData, Platform, UserPreferences } from "../types";

export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.API_KEY || '';
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
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
  const openai = getOpenAIClient();
  
  const isUrl = input.startsWith('http');
  const prompt = isUrl 
    ? `Analyze the following URL: ${input}. 
       1. Extract the core narrative, key arguments, and professional insights.
       2. Structure your "analysisPoints" as detailed, high-impact paragraphs.
       Please utilize your broad knowledgebase to perform a detailed assessment of this content.`
    : `Analyze the following text: "${input}". Extract the core narrative and key arguments. Provide a list of detailed points.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an elite research executive and content analyzer. Provide incredibly rich, specific, and structured JSON output.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "content_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            type: { type: "string", description: "Must be 'YouTube' or 'Blog'" },
            duration: { type: "string" },
            readTime: { type: "string" },
            summary: { type: "string" },
            impactSummary: { type: "string" },
            analysisPoints: { 
              type: "array", 
              items: { type: "string" },
              description: "A detailed list of the core points and arguments."
            }
          },
          required: ["title", "type", "duration", "readTime", "summary", "impactSummary", "analysisPoints"],
          additionalProperties: false
        }
      }
    },
    max_tokens: 3000
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    const data = JSON.parse(text);
    return {
      card: {
        title: data.title || "Untitled Content",
        type: (data.type === 'YouTube' ? 'YouTube' : 'Blog') as any,
        duration: data.duration || "5:00",
        readTime: data.readTime || "3 min",
        summary: data.summary || "No summary available."
      },
      impact: data.impactSummary || "No impact summary provided.",
      fullContent: (data.analysisPoints || []).join('\n\n')
    };
  } catch (e) {
    console.error("JSON Parsing Error in fetchAndAnalyzeContent:", e);
    return {
      card: {
        title: "Content Analysis",
        type: isUrl ? 'YouTube' : 'Blog',
        summary: "The structured analysis encountered a format error, but the core content is still usable."
      } as any,
      impact: "High-value insights detected in the source material.",
      fullContent: input
    };
  }
}

export async function generatePlatformContent(
  platform: Platform, 
  sourceContent: string, 
  preferences?: UserPreferences
): Promise<string> {
  const openai = getOpenAIClient();
  
  const platformInstructions: Record<Platform, string> = {
    [Platform.LinkedIn]: "EXECUTIVE INSIGHT: Start with a disruptive hook that challenges a common industry belief. Provide 3 'golden nuggets' that are specific and actionable. Close with a thought-provoking question. No generic hashtags. 1.5x line spacing.",
    [Platform.InstagramPost]: "CAPTION: High-converting, visual-first storytelling. First line must stop the scroll. Use simple language. CTA should feel like a personal recommendation.",
    [Platform.InstagramReel]: "SCRIPT (60s): 0-3s is a hard hook. 3-50s is rapid-fire value with specific [Visual: Description] cues. 50-60s is a soft, high-trust CTA. Non-robotic language.",
    [Platform.Facebook]: "COMMUNITY TONE: Write like you're talking to a group of peers. Focus on the 'Why' behind the content. High empathy, low fluff.",
    [Platform.TweetThread]: "THREAD (5 Tweets): Tweet 1: A bold, data-backed or highly specific claim. Tweets 2-4: The core 'how-to' or logic. Tweet 5: The big takeaway + link. No emojis on every line.",
    [Platform.Email]: "NEWSLETTER: Subject line should be short and lowercase (e.g. 'the problem with x'). Body should feel like a 1-on-1 personal update. Focus on one specific transformation.",
    [Platform.Image]: "PROMPT: Create an incredibly detailed, high-fashion, cinematic cinematic visual prompt for image generation, describing textures, photographic lenses, framing, light color palette, and mood.",
    [Platform.Video]: "SCENE DIRECTION: Describe a cinematic, slow-motion sequence that perfectly encapsulates this concept visually, including camera panning directions, contrast lighting, and color scheme."
  };

  let preferenceInstructions = "";
  if (preferences) {
    const depth = preferences.complexity === 'simple' 
      ? "- COMPLEXITY & DEPTH: Keep the content highly simple and direct. Use basic explanations, high-level structural digests, and avoid deep technical or multi-layered systematic breakdowns."
      : "- COMPLEXITY & DEPTH: Build highly detailed, complex, nuanced, and structurally complex content. Target rigorous breakdowns, multi-layered insights, and explore advanced implications.";
      
    const toneMastery = preferences.tone === 'basic'
      ? "- TONE & TERMINOLOGY: Keep it conversational, basic, friendly, and accessible. Replace heavy terms with relatable real-world analogies."
      : "- TONE & TERMINOLOGY: Use a technical, expert, and domain-authentic tone. Utilize standard professional or technical terminology with zero dumbing-down.";
      
    const lengthStyle = preferences.length === 'short'
      ? "- TARGET LENGTH: Be extremely concise and crisp (short style). Focus on high-impact hooks, direct answers, and minimum background fluff."
      : preferences.length === 'long'
        ? "- TARGET LENGTH: Be comprehensive and detailed (long style). Build dense sub-points, thorough reasoning, and rich value-adds with significant details."
        : "- TARGET LENGTH: Balanced medium length. Deliver comfortable reading speed with perfect detail-to-conciseness ratio.";

    const targetAudience = preferences.audience 
      ? `- TARGET AUDIENCE PROFILE: Align language, tone, metaphors, and value proposition specifically for: ${preferences.audience}` 
      : "";

    const userDirectives = preferences.customInstructions 
      ? `- SPECIAL STYLE DIRECTIVES & RULES:\n${preferences.customInstructions}` 
      : "";

    preferenceInstructions = `
PREFERENCE ALIGNMENT RULES (STRICTLY ADHERE TO THESE):
${depth}
${toneMastery}
${lengthStyle}
${targetAudience}
${userDirectives}
`;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: GLOBAL_TONE_INSTRUCTION + "\n" + platformInstructions[platform] + "\n" + preferenceInstructions
      },
      {
        role: 'user',
        content: `Platform: ${platform}\nSource Content: ${sourceContent}`
      }
    ],
    max_tokens: 2500
  });

  return response.choices[0]?.message?.content || "Failed to generate content.";
}

export async function generateImage(prompt: string): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Cinematic editorial branding illustration/photo, professional lighting: ${prompt}`,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json'
  });

  const b64 = response.data[0]?.b64_json;
  if (b64) {
    return `data:image/png;base64,${b64}`;
  }
  
  const url = response.data[0]?.url;
  if (url) {
    return url;
  }
  
  throw new Error("No image generated from OpenAI DALL-E");
}

// Map high-quality cinematic slow-motion looping background stock videos for ultimate premium experience
const STOCK_CINEMATIC_LOOPS = [
  "https://assets.mixkit.co/videos/preview/mixkit-glowing-connections-in-a-digital-network-preview-41662-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-rotating-world-globe-with-digital-markers-preview-41661-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-mesh-of-interconnected-particles-preview-41665-large.mp4"
];

export async function generateVideo(prompt: string): Promise<string> {
  // Since OpenAI does not provide a public text-to-video API endpoint yet, we match the prompt to select
  // a beautiful HD stock video loop aligned with premium branding to serve as the visual backdrop.
  const lowerPrompt = prompt.toLowerCase();
  
  let selectedVideoUrl = STOCK_CINEMATIC_LOOPS[2]; // Default abstract particle network
  
  if (lowerPrompt.includes("global") || lowerPrompt.includes("world") || lowerPrompt.includes("market") || lowerPrompt.includes("reach") || lowerPrompt.includes("user")) {
    selectedVideoUrl = STOCK_CINEMATIC_LOOPS[1]; // Rotating world globe
  } else if (lowerPrompt.includes("network") || lowerPrompt.includes("data") || lowerPrompt.includes("tech") || lowerPrompt.includes("connect") || lowerPrompt.includes("code")) {
    selectedVideoUrl = STOCK_CINEMATIC_LOOPS[0]; // Glowing connections network
  }
  
  // Return the selected high-quality background video asset
  return selectedVideoUrl;
}
