import { IMessage, UserType } from "@/lib/type";
import { useConversationStore } from "@/store/chat-store";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";

type ChatAvatarActionProps = {
    message: IMessage;
    me: UserType | undefined;
    fromAI?: boolean;
};

export default function ChatAvatarAction({ message, me, fromAI }: ChatAvatarActionProps) {
    const { selectedConversation, setSelectedConversation } = useConversationStore();

    const isMember = !!selectedConversation?.participants.includes(message.sender._id);
    const isGroup = !!selectedConversation?.isGroup;
    const isAdmin = selectedConversation?.admin === me?._id;
    const removeUserFromConversation = useMutation(api.conversations.removeUserFromConversation);
    const addUserToConversation = useMutation(api.conversations.addUserToConversation);

    const handleRemoveUserFromConversation = async (e: React.MouseEvent) => {
        if (fromAI) return;
        e.stopPropagation();
        if (!selectedConversation) return;
        try {
            await removeUserFromConversation({
                conversationId: selectedConversation._id,
                userId: message.sender._id,
            });

            setSelectedConversation({
                ...selectedConversation,
                participants: selectedConversation.participants.filter(
                    (id) => id !== message.sender._id
                ),
            });
        } catch (error) {
            console.error("Failed to kick user:", error);
            toast.error("Failed to kick user");
        }
    };

    const handleAddUserToConversation = async (e: React.MouseEvent) => {
        if (fromAI) return;
        e.stopPropagation();
        if (!selectedConversation) return;
        try {
            await addUserToConversation({
                conversationId: selectedConversation._id,
                userId: message.sender._id,
            });

            setSelectedConversation({
                ...selectedConversation,
                participants: [...selectedConversation.participants, message.sender._id],
            });
        } catch (error) {
            console.error("Failed to add user:", error);
            toast.error("Failed to add user");
        }
    };

    return (
        <div className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group">
            {isGroup && message.sender.name}

            {!isMember && !fromAI && isGroup && (
                <Ban size={16} className="text-red-500" onClick={handleAddUserToConversation} />
            )}
            {isGroup && isMember && isAdmin && (
                <LogOut
                    size={16}
                    className="text-red-500 opacity-0 group-hover:opacity-100"
                    onClick={handleRemoveUserFromConversation}
                />
            )}
        </div>
    );
}
