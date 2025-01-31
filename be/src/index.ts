require("dotenv").config();

import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "create a react todo app";

async function main() {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

main();