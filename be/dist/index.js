"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
const nextjs_1 = require("./utils/boilerPlate/nextjs");
const react_1 = require("./utils/boilerPlate/react");
const nodejs_1 = require("./utils/boilerPlate/nodejs");
const cleanUIPrompt_1 = require("./utils/prompt/cleanUIPrompt");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
function getTypeOfProject(userPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectTypePrompt = "Determine the project type based on the user prompt inside the <UserPrompt></UserPrompt> tags. Return `react` or `nextjs` or `node`(node is for nodejs backend applications) if explicitly mentioned; default to `react` if unspecified. If neither applies, return null.";
        const prompt = `${projectTypePrompt}\t\t<UserPrompt>${userPrompt}</UserPrompt>`;
        const result = yield model.generateContent(prompt);
        return result.response.text();
    });
}
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userPrompt = req.body.userPrompt;
        let projectType = yield getTypeOfProject(userPrompt);
        projectType = (_a = projectType === null || projectType === void 0 ? void 0 : projectType.trim()) !== null && _a !== void 0 ? _a : null;
        if (!projectType || !["node", "react", "nextjs"].includes(projectType)) {
            return res.status(400).send("Invalid project type");
        }
        if (projectType === "nextjs") {
            return res.status(200).json({
                prompts: [cleanUIPrompt_1.cleanUIPrompt, `Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${nextjs_1.nextJsBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                boilerPlate: nextjs_1.nextJsBoilerPlate
            });
        }
        if (projectType === "react") {
            return res.status(200).json({
                prompts: [cleanUIPrompt_1.cleanUIPrompt, `Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${react_1.reactBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                boilerPlate: react_1.reactBoilerPlate
            });
        }
        if (projectType === "node") {
            return res.status(200).json({
                prompts: [`Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n.${nodejs_1.nodeBoilerPlate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n.`],
                boilerPlate: nodejs_1.nodeBoilerPlate
            });
        }
    }
    catch (error) {
        console.error("Error in /template route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// app.post("/chat", async(req: Request, res: Response): Promise<any> => { 
//     try {
// async function main() {
//     const systemPrompt = getSystemPrompt();
//     const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
//     let type = await getTypeOfProject();
//     type = type?.trim() ?? null;
//     if (type === "null") {
//         const result = await model.generateContent(fullPrompt);
//         console.log(result.response.text());
//         return;
//     }
//     const boilerPlate = type === 'nextjs' ? nextJsBoilerPlate : type === "node" ? nodeBoilerPlate : reactBoilerPlate;
//     const finalPrompt = type === "node" ? `${systemPrompt}\n\n${boilerPlate}\n\n${userPrompt}` : `${systemPrompt}\n\n${boilerPlate}\n\n${cleanUIPrompt}\n\n${userPrompt}`
//     const result = await model.generateContentStream(finalPrompt); 
//     for await (const chunk of result.stream) {
//         const chunkText = chunk.text();
//         console.log(chunkText);
//     }
// }
// main();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
