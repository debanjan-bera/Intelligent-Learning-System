import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  private static readonly apiKey = process.env.GEMINI_API_KEY;
  private static readonly modelCandidates = ["gemini-2.5-flash"];

  private static readonly genAI = new GoogleGenerativeAI(AIService.apiKey as string);

  private static isNotFoundError(error: unknown) {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404
    );
  }

  private static formatError(error: unknown) {
    if (error instanceof Error) {
      const withStatus = error as Error & {
        status?: number;
        statusText?: string;
      };

      if (withStatus.status) {
        return `Gemini API error (${withStatus.status}${withStatus.statusText ? ` ${withStatus.statusText}` : ""}): ${withStatus.message}`;
      }

      return error.message;
    }

    return "Unknown Gemini API error";
  }

  static async generateQuizQuestions(
    topic: string,
    difficulty: string,
    numberOfQuestions: number
  ) {
    if (!AIService.apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    let lastError: unknown;

    const prompt = `
Generate ${numberOfQuestions} multiple choice quiz questions.

Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- Each question must have 4 options
- Provide correct answer
- Provide short explanation
- Return ONLY valid JSON (no markdown, no code fences)

Format:

[
 {
  "question": "",
  "options": ["", "", "", ""],
  "correctAnswer": "",
  "explanation": ""
 }
]
`;

    for (const modelName of AIService.modelCandidates) {
      try {
        const model = AIService.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });

        const result = await model.generateContent(prompt);

        const response = await result.response;

        return response.text();
      } catch (error) {
        lastError = error;

        if (AIService.isNotFoundError(error)) {
          continue;
        }

        throw new Error(AIService.formatError(error));
      }
    }

    throw new Error(
      `No supported Gemini model was found. Tried: ${AIService.modelCandidates.join(
        ", "
      )}. Last error: ${AIService.formatError(lastError)}`
    );
  }
}

export default AIService;