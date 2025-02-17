"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrompt = UserPrompt;
function UserPrompt(userPrompt) {
    return `
        <bolt_running_commands>\n</bolt_running_commands>\n\nCurrent Message:\n\\${userPrompt}\n\nFile Changes:\n\nHere is a list of all files that have been modified since the start of the conversation.\nThis information serves as the true contents of these files!\n\nThe contents include either the full file contents or a diff (when changes are smaller and localized).\n\nUse it to:\n - Understand the latest file modifications\n - Ensure your suggestions build upon the most recent version of the files\n - Make informed decisions about changes\n - Ensure suggestions are compatible with existing code\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - /home/project/.bolt/config.json
    `;
}
