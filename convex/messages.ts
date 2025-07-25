import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const sendTextMessage = mutation({
    args: {
        sender: v.string(),
        content: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        const conversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("_id"), args.conversation))
            .first();

        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }

        if (!conversation.participants.includes(user._id)) {
            throw new ConvexError("You are not part of this conversation");
        }

        await ctx.db.insert("messages", {
            conversation: args.conversation,
            sender: args.sender,
            content: args.content,
            messageType: "text",
        });

        if (args.content.startsWith("@kaka-img")) {
            // Schedule the chat action to run immediately
            await ctx.scheduler.runAfter(100, api.chatbot.image, {
                messageBody: args.content,
                conversation: args.conversation,
            });
        } else if (args.content.startsWith("@kaka")) {
            // Schedule the chat action to run immediately
            await ctx.scheduler.runAfter(100, api.chatbot.chat, {
                messageBody: args.content,
                conversation: args.conversation,
            });
        }
    },
});

export const sendKakaMessage = mutation({
    args: {
        content: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            content: args.content,
            conversation: args.conversation,
            sender: "KAKA",
            messageType: "text",
        });
    },
});

export const sendKakaIMessage = mutation({
    args: {
        content: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            content: args.content,
            conversation: args.conversation,
            sender: "KAKA_I",
            messageType: "image",
        });
    },
});

export const sendImage = mutation({
    args: { imgId: v.id("_storage"), conversation: v.id("conversations"), sender: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        const conversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("_id"), args.conversation))
            .first();

        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }

        if (!conversation.participants.includes(user._id)) {
            throw new ConvexError("You are not part of this conversation");
        }

        const imgUrl = (await ctx.storage.getUrl(args.imgId)) as string;

        await ctx.db.insert("messages", {
            content: imgUrl,
            conversation: args.conversation,
            sender: args.sender,
            messageType: "image",
        });
    },
});

export const sendVideo = mutation({
    args: { videoId: v.id("_storage"), conversation: v.id("conversations"), sender: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        const conversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("_id"), args.conversation))
            .first();

        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }

        if (!conversation.participants.includes(user._id)) {
            throw new ConvexError("You are not part of this conversation");
        }

        const videoUrl = (await ctx.storage.getUrl(args.videoId)) as string;

        await ctx.db.insert("messages", {
            content: videoUrl,
            conversation: args.conversation,
            sender: args.sender,
            messageType: "video",
        });
    },
});

export const getMessages = query({
    args: {
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversation", args.conversation))
            .collect();

        // Unoptimized query to get messages for a conversation
        // const messagesWithSender = await Promise.all(
        // messages.map(async (message) => {
        //     const sender = await ctx.db
        //         .query("users")
        //         .filter((q) => q.eq(q.field("_id"), message.sender))
        //         .first();
        //     return {
        //         ...message,
        //         sender,
        //     };
        // }));

        const userProfileCache = new Map();

        const messagesWithSender = await Promise.all(
            messages.map(async (message) => {
                if (message.sender === "KAKA") {
                    return {
                        ...message,
                        sender: { name: "KAKA", image: "/gpt.png" },
                    };
                } else if (message.sender === "KAKA_I") {
                    return {
                        ...message,
                        sender: { name: "KAKA_I", image: "/dall-e.png" },
                    };
                }
                let sender;
                if (userProfileCache.has(message.sender)) {
                    sender = userProfileCache.get(message.sender);
                } else {
                    sender = await ctx.db
                        .query("users")
                        .filter((q) => q.eq(q.field("_id"), message.sender))
                        .first();
                    userProfileCache.set(message.sender, sender);
                }
                return {
                    ...message,
                    sender,
                };
            })
        );

        return messagesWithSender;
    },
});
