require("dotenv").config();

import {GoogleGenerativeAI} from "@google/generative-ai";
import { getSystemPrompt } from "./utils/prompt/prompt";
import { nextJsBoilerPlate } from "./utils/boilerPlate/nextjs";
import { reactBoilerPlate } from "./utils/boilerPlate/react";
import { UserPrompt } from "./utils/prompt/userPrompt";
import { cleanUIPrompt } from "./utils/prompt/cleanUIPrompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const userPrompt = "create a todo app";

async function getTypeOfProject(): Promise<string | null> {
    const projectTypePrompt = "Determine the project type based on the user prompt inside the <UserPrompt></UserPrompt> tags. Return `react` or `nextjs` if explicitly mentioned; default to `react` if unspecified. If neither applies, return null."; 
    const prompt = `${projectTypePrompt}\t\t<UserPrompt>${userPrompt}</UserPrompt>`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function main() {
    const systemPrompt = getSystemPrompt();
    const fullPrompt = `${systemPrompt}\n\n${UserPrompt(userPrompt)}`;
    let type = await getTypeOfProject();
    type = type?.trim() ?? null;

    if (type === "null") {
        const result = await model.generateContent(fullPrompt);
        console.log(result.response.text());
        return;
    }
    
    const boilerPlate = type === 'nextjs' ? nextJsBoilerPlate : reactBoilerPlate;
    const fullPrompt2 = `${systemPrompt}\n\n${cleanUIPrompt}\n\n${UserPrompt(userPrompt)}`;

    const result = await model.generateContentStream(fullPrompt2); 
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
    }
}

main();