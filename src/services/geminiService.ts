import type { AgenticNPC } from '../types/npc';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export interface DialogueContext {
  npc: AgenticNPC;
  playerMessage: string;
  playerName: string;
  playerProfession: string;
  locationName: string;
  locationDescription: string;
}

export interface DialogueResponse {
  message: string;
  mood: AgenticNPC['mood'];
  newThought?: string;
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GEMINI_API_KEY;
  }

  async generateDialogue(context: DialogueContext): Promise<DialogueResponse> {
    if (!this.apiKey) {
      return this.fallbackDialogue(context);
    }

    try {
      const prompt = this.constructPrompt(context);

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
        }),
      });

      if (!response.ok) {
        console.error('Gemini API error:', response.statusText);
        return this.fallbackDialogue(context);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return this.parseResponse(generatedText, context.npc);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.fallbackDialogue(context);
    }
  }

  private constructPrompt(context: DialogueContext): string {
    const { npc, playerMessage, playerName, playerProfession, locationName, locationDescription } = context;

    return `You are ${npc.name}, a ${npc.age}-year-old ${npc.profession} at the 1889 Paris World's Fair.

BACKSTORY:
${npc.backstory}

PERSONALITY TRAITS:
- Sociability: ${(npc.traits.sociability * 10).toFixed(1)}/10
- Curiosity: ${(npc.traits.curiosity * 10).toFixed(1)}/10
- Ambition: ${(npc.traits.ambition * 10).toFixed(1)}/10
- Caution: ${(npc.traits.caution * 10).toFixed(1)}/10
- Creativity: ${(npc.traits.creativity * 10).toFixed(1)}/10

CURRENT STATE:
- Location: ${locationName} (${locationDescription})
- Activity: ${npc.currentActivity}
- Mood: ${npc.mood}
- Energy: ${npc.energy}/100
- Current Goal: ${npc.currentGoal?.description || 'None'}

RECENT THOUGHTS:
${npc.recentThoughts.map((t) => `- ${t}`).join('\n')}

KNOWN FACTS:
${npc.knownFacts.map((f) => `- ${f}`).join('\n')}

RECENT HISTORY (what you've done today):
${npc.history.slice(-5).map((h) => `- ${h.description}`).join('\n')}

${playerName}, a ${playerProfession}, says to you: "${playerMessage}"

Respond as ${npc.name} in 1-3 sentences. Stay in character with your personality, mood, and current situation. Be historically accurate to 1889 Paris. Your speech should reflect the refined, somewhat formal language of the Belle Époque era.

Format your response as JSON:
{
  "message": "your dialogue response here",
  "mood": "happy" | "neutral" | "sad" | "excited" | "anxious" | "tired",
  "newThought": "a brief thought about this interaction (optional)"
}`;
  }

  private parseResponse(generatedText: string, npc: AgenticNPC): DialogueResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || generatedText,
          mood: parsed.mood || npc.mood,
          newThought: parsed.newThought,
        };
      }

      // Fallback: use raw text
      return {
        message: generatedText.trim(),
        mood: npc.mood,
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        message: generatedText.trim(),
        mood: npc.mood,
      };
    }
  }

  private fallbackDialogue(context: DialogueContext): DialogueResponse {
    const { npc } = context;

    const responses = [
      `Bonjour, ${context.playerName}. It is a pleasure to make your acquaintance at this magnificent exposition.`,
      `Indeed, the innovations on display here are quite remarkable, wouldn't you agree?`,
      `Ah yes, as a ${npc.profession}, I find the fair to be endlessly fascinating.`,
      `Forgive me, but I must attend to my duties. Perhaps we shall speak again later.`,
      `The crowds today are quite something! One can scarcely move through the galleries.`,
    ];

    const rng = Math.floor(Math.random() * responses.length);

    return {
      message: responses[rng],
      mood: npc.mood,
      newThought: `I spoke with ${context.playerName}.`,
    };
  }

  async generateNPCThought(npc: AgenticNPC, context: string): Promise<string> {
    if (!this.apiKey) {
      return `I wonder what ${context}...`;
    }

    try {
      const prompt = `You are ${npc.name}, a ${npc.profession} at the 1889 Paris World's Fair.

Context: ${context}

Current mood: ${npc.mood}
Current activity: ${npc.currentActivity}

Generate a single brief thought (1 short sentence) that ${npc.name} might have in this situation. The thought should reflect their personality and current state. Use first-person perspective.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 50,
          },
        }),
      });

      if (!response.ok) {
        return `I wonder about ${context}...`;
      }

      const data = await response.json();
      const thought = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return thought.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Error generating thought:', error);
      return `I wonder about ${context}...`;
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;
