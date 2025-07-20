"use client";

import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import EmojiPiker, { Theme } from "emoji-picker-react";
import useComponentVisible from "@/hooks/useComponentVisible";
import { useTheme } from "next-themes";

export default function MessageInput() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme === "dark" ? "dark" : "light";
    const [msgText, setMsgText] = useState("");
    const sendTextMessage = useMutation(api.messages.sendTextMessage);
    const me = useQuery(api.users.getMe);
    const { selectedConversation } = useConversationStore();
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (msgText.trim() === "") return;

        try {
            await sendTextMessage({
                content: msgText,
                sender: me!._id,
                conversation: selectedConversation!._id,
            });
        } catch (error) {
            toast.error("Failed to send message");
            console.error("Error sending message:", error);
        }
    };
    return (
        <div className="bg-gray-primary p-2 flex gap-4 items-center">
            <div className="flex gap-2 ml-2">
                {/* EMOJI PICKER WILL GO HERE */}
                <div
                    ref={ref as React.RefObject<HTMLDivElement>}
                    onClick={() => setIsComponentVisible(true)}
                    className="relative cursor-pointer"
                >
                    {isComponentVisible && (
                        <EmojiPiker
                            theme={currentTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                            style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                left: "1rem",
                                zIndex: 50,
                            }}
                            onEmojiClick={(emoji) => {
                                setMsgText((prev) => prev + emoji.emoji);
                            }}
                        />
                    )}
                    <Laugh className="text-gray-600 dark:text-gray-400" />
                </div>
                <Plus className="text-gray-600 dark:text-gray-400" />
            </div>
            <form className="w-full flex gap-3" onSubmit={handleSendMessage}>
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Type a message"
                        className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                    />
                </div>
                <div className="mr-4 flex items-center gap-3">
                    {msgText.length > 0 ? (
                        <Button
                            type="submit"
                            size={"sm"}
                            className="bg-transparent text-foreground hover:bg-transparent"
                        >
                            <Send />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            size={"sm"}
                            className="bg-transparent text-foreground hover:bg-transparent"
                        >
                            <Mic />
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
