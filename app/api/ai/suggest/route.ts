import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { skills } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: "A list of skills is required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `
      Based on the following list of skills a user is learning: [${skills.join(
        ", "
      )}], 
      suggest 3 new, related technologies or concepts they could learn next.
      Your answer MUST be a valid JSON array of strings, and nothing else.
      The language of the skills in the response must be Russian.
      For example: ["Навык 1", "Навык 2", "Навык 3"].
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    if (text.startsWith("```json")) {
      text = text.replace("```json\n", "").replace("\n```", "");
    } else if (text.startsWith("```")) {
      text = text.replace("```\n", "").replace("\n```", "");
    }
    text = text.trim();

    try {
      const suggestedSkills = JSON.parse(text);
      return NextResponse.json({ suggestedSkills });
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response. The response was: " + text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in AI suggestion API:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
