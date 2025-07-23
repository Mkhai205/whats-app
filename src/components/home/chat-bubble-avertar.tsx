import { IMessage } from "@/lib/type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ChatBubbleAvatarProps = {
    message: IMessage;
    isMember: boolean;
    isGroup?: boolean;
    fromAI?: boolean;
};

export default function ChatBubbleAvatar({
    message,
    isMember,
    isGroup,
    fromAI,
}: ChatBubbleAvatarProps) {
    if (!isGroup && !fromAI) return null;

    return (
        <Avatar className="mt-1.5 overflow-visible relative">
            {message.sender.isOnline && isMember && (
                <div className="absolute top-0 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground" />
            )}
            <AvatarImage
                src={message.sender?.image}
                className="rounded-full object-cover w-9 h-9"
            />
            <AvatarFallback className="w-9 h-9 ">
                <div className="animate-pulse bg-gray-tertiary rounded-full"></div>
            </AvatarFallback>
        </Avatar>
    );
}
