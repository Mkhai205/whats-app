import { GoogleGenAI, Modality } from "@google/genai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
}
const gemini = new GoogleGenAI({
    apiKey,
});

export const chat = action({
    args: {
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash",
            contents: args.messageBody,
            config: {
                systemInstruction:
                    "You are a helpful assistant in a chat responding to questions with short answers.",
            },
        });

        const message = response.text;

        await ctx.runMutation(api.messages.sendKakaMessage, {
            content: message ?? "Sorry, I couldn't generate a response.",
            conversation: args.conversation,
        });
    },
});

export const image = action({
    args: {
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        try {
            const response = await gemini.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: args.messageBody,
                config: {
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });

            const parts = response.candidates?.[0]?.content?.parts;

            if (!parts || parts.length === 0) {
                await ctx.runMutation(api.messages.sendKakaIMessage, {
                    content: "/poopenai.png",
                    conversation: args.conversation,
                });
                return;
            }

            let imageData = null;
            for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
                    imageData = part.inlineData.data; // base64 string
                    break;
                }
            }

            if (imageData) {
                // Convert base64 to binary data using atob (Convex compatible)
                const binaryString = atob(imageData);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // Upload to Convex storage
                const uploadUrl = await ctx.storage.generateUploadUrl();
                const uploadResponse = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": "image/png" },
                    body: bytes,
                });

                if (uploadResponse.ok) {
                    const { storageId } = await uploadResponse.json();
                    const imageUrl = await ctx.storage.getUrl(storageId);

                    await ctx.runMutation(api.messages.sendKakaIMessage, {
                        content: imageUrl || "/poopenai.png",
                        conversation: args.conversation,
                    });
                } else {
                    throw new Error("Failed to upload generated image");
                }
            } else {
                console.log("No image data found in response parts:", parts);
                await ctx.runMutation(api.messages.sendKakaIMessage, {
                    content: "/poopenai.png",
                    conversation: args.conversation,
                });
            }
        } catch (error) {
            console.error("Error generating image:", error);
            await ctx.runMutation(api.messages.sendKakaIMessage, {
                content: "/poopenai.png",
                conversation: args.conversation,
            });
        }
    },
});
