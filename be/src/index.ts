require("dotenv").config();

import {GoogleGenerativeAI} from "@google/generative-ai";
import { getSystemPrompt } from "./utils/prompt/prompt";
import { nextJsBoilerPlate } from "./utils/boilerPlate/nextjs";
import { reactBoilerPlate } from "./utils/boilerPlate/react";
import { nodeBoilerPlate } from "./utils/boilerPlate/nodejs";
import { cleanUIPrompt } from "./utils/prompt/cleanUIPrompt";
import express, { Response, Request } from "express";

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getTypeOfProject(userPrompt: string): Promise<string | null> {
    const projectTypePrompt = "Determine the project type based on the user prompt inside the <UserPrompt></UserPrompt> tags. Return `react` or `nextjs` or `node`(node is for nodejs backend applications) if explicitly mentioned; default to `react` if unspecified. If neither applies, return null."; 
    const prompt = `${projectTypePrompt}\t\t<UserPrompt>${userPrompt}</UserPrompt>`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

app.post("/template", async(req: Request, res: Response): Promise<any> => { 
    try {
        const userPrompt = req.body.userPrompt;
        let projectType = await getTypeOfProject(userPrompt);
        projectType = projectType?.trim() ?? null;

        if (!projectType || !["node", "react", "nextjs"].includes(projectType)) {
            return res.status(400).send("Invalid project type");
        }

        if (projectType === "nextjs") {
            return res.status(200).json({ 
                prompts: [cleanUIPrompt, `Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${nextJsBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                boilerPlate: nextJsBoilerPlate 
            });
        }

        if (projectType === "react") {
            return res.status(200).json({ 
                prompts: [cleanUIPrompt, `Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${reactBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                boilerPlate: reactBoilerPlate 
            });
        }

        if (projectType === "node") {
            return res.status(200).json({ 
                prompts: [`Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${nodeBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n.`],
                boilerPlate: nodeBoilerPlate 
            });
        }
    } catch (error) {
        console.error("Error in /template route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/chat", async(req: Request, res: Response): Promise<any> => { 
    try {
        let messages = req.body.messages;
        messages = getSystemPrompt() + "\n\n" + messages;
        const result = await model.generateContentStream(messages); 
        res.setHeader('Content-Type', 'text/plain');
        for await (const chunk of result.stream) {
            res.write(chunk.text()); 
        }
        res.end();
    } catch (error) {
        console.error("Error in /chat route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});