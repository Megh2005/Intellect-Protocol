import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const {
      subject,
      style,
      environment,
      genre,
      timePeriod,
      artMedium,
      mood,
      lighting,
      colorPalette,
      composition,
      customDetails,
    } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert prompt writer for an AI image generation model.
      Your task is to generate a single paragraph, plain text prompt based on the following user-provided criteria.
      Do not use any bold, italic, or any other special formatting.
      The prompt should be descriptive, detailed, and evocative to help the AI generate a high-quality image.

      User Criteria:
      - Main Subject: ${subject || "not specified"}
      - Artistic Style: ${style || "not specified"}
      - Environment: ${environment || "not specified"}
      - Genre: ${genre || "not specified"}
      - Time Period: ${timePeriod || "not specified"}
      - Art Medium: ${artMedium || "not specified"}
      - Mood: ${mood || "not specified"}
      - Lighting: ${lighting || "not specified"}
      - Color Palette: ${colorPalette || "not specified"}
      - Composition: ${composition || "not specified"}
      - Additional Details: ${customDetails || "none"}

      Based on these criteria, generate a creative and detailed prompt.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, prompt: text });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
