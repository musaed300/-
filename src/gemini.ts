import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getSmartSchedule = async (tasks: any[], userEnergy: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      As a productivity expert, reorder these tasks based on the user's current energy level (${userEnergy}/5).
      High energy (4-5) means they should do high-priority, high-energy tasks.
      Low energy (1-2) means they should do low-energy, routine tasks.
      
      Tasks: ${JSON.stringify(tasks)}
      
      Return the reordered list of task IDs only, in order of execution.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return tasks.map(t => t.id);
  }
};

export const getProductivityInsights = async (completedTasks: any[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze these completed tasks and provide a brief, motivating insight (max 2 sentences) about the user's productivity pattern.
      Tasks: ${JSON.stringify(completedTasks)}
    `,
  });
  return response.text;
};
