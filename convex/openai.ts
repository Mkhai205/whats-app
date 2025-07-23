import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
}
const openai = new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const chat = action({
    args: {
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant in a chat responding to questions with short answers.",
                },
                {
                    role: "user",
                    content: args.messageBody,
                },
            ],
        });

        const message = response.choices[0].message.content;

        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: message ?? "Sorry, I couldn't generate a response.",
            conversation: args.conversation,
        });
    },
});
