import ChatBubble from "./chat-bubble";
import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function MessageContainer() {
    const { selectedConversation } = useConversationStore();
    const me = useQuery(api.users.getMe);
    const messages = useQuery(api.messages.getMessages, {
        conversation: selectedConversation!._id,
    });

    return (
        <div className="relative p-4 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
            <div className="mx-2 flex flex-col gap-3 h-full">
                {messages?.map((message, index) => (
                    <ChatBubble
                        key={message._id}
                        message={message}
                        previousMessage={index > 0 ? messages[index - 1] : undefined}
                        me={me}
                    />
                ))}
            </div>
        </div>
    );
}
