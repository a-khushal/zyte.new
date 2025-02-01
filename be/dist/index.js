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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
const prompt_1 = require("./utils/prompt/prompt");
const nextjs_1 = require("./utils/boilerPlate/nextjs");
const react_1 = require("./utils/boilerPlate/react");
const userPrompt_1 = require("./utils/prompt/userPrompt");
const cleanUIPrompt_1 = require("./utils/prompt/cleanUIPrompt");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const userPrompt = "create a todo app";
function getTypeOfProject() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectTypePrompt = "Determine the project type based on the user prompt inside the <UserPrompt></UserPrompt> tags. Return `react` or `nextjs` if explicitly mentioned; default to `react` if unspecified. If neither applies, return null.";
        const prompt = `${projectTypePrompt}\t\t<UserPrompt>${userPrompt}</UserPrompt>`;
        const result = yield model.generateContent(prompt);
        return result.response.text();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d;
        const systemPrompt = (0, prompt_1.getSystemPrompt)();
        const fullPrompt = `${systemPrompt}\n\n${(0, userPrompt_1.UserPrompt)(userPrompt)}`;
        let type = yield getTypeOfProject();
        type = (_d = type === null || type === void 0 ? void 0 : type.trim()) !== null && _d !== void 0 ? _d : null;
        if (type === "null") {
            const result = yield model.generateContent(fullPrompt);
            console.log(result.response.text());
            return;
        }
        const boilerPlate = type === 'nextjs' ? nextjs_1.nextJsBoilerPlate : react_1.reactBoilerPlate;
        const fullPrompt2 = `${systemPrompt}\n\n${cleanUIPrompt_1.cleanUIPrompt}\n\n${(0, userPrompt_1.UserPrompt)(userPrompt)}`;
        const result = yield model.generateContentStream(fullPrompt2);
        try {
            for (var _e = true, _f = __asyncValues(result.stream), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                _c = _g.value;
                _e = false;
                const chunk = _c;
                const chunkText = chunk.text();
                console.log(chunkText);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main();
