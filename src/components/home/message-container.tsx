import ChatBubble from "./chat-bubble";
import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";

export default function MessageContainer() {
    const { selectedConversation } = useConversationStore();
    const me = useQuery(api.users.getMe);
    const messages = useQuery(api.messages.getMessages, {
        conversation: selectedConversation!._id,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    }, [messages]);

    return (
        <div className="relative px-4 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
            <div className="flex flex-col gap-3 mb-3">
                {messages?.map((message, index) => (
                    <ChatBubble
                        key={message._id}
                        message={message}
                        previousMessage={index > 0 ? messages[index - 1] : undefined}
                        me={me}
                    />
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}
