import { cn, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSeenSvg } from "@/lib/svgs";
import { ImageIcon, Users, VideoIcon } from "lucide-react";
import { ConversationWithDetails, UserType } from "@/lib/type";
import { useConversationStore } from "@/store/chat-store";

export default function Conversation({
    conversation,
    me,
}: {
    conversation: ConversationWithDetails;
    me: UserType | undefined;
}) {
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const conversationImage = conversation.groupImage || conversation.image;
    const conversationName = conversation.groupName || conversation.name;
    const lastMessage = conversation.lastMessage;
    const lastMessageType = lastMessage?.messageType;

    const activeBgClass = selectedConversation?._id === conversation._id;

    return (
        <>
            <div
                className={cn("flex gap-2 items-center p-3 hover:bg-chat-hover cursor-pointer", {
                    "bg-gray-tertiary": activeBgClass,
                })}
                onClick={() => setSelectedConversation(conversation)}
            >
                <Avatar className="border border-gray-900 overflow-visible relative">
                    {conversation.isOnline && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground" />
                    )}
                    <AvatarImage
                        src={conversationImage || "/placeholder.png"}
                        className="object-cover rounded-full w-10 h-10"
                    />
                    <AvatarFallback>
                        <div className="animate-pulse bg-gray-tertiary w-10 h-10 rounded-full"></div>
                    </AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="flex items-center">
                        <h3 className="text-xs lg:text-sm font-medium">{conversationName}</h3>
                        <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
                            {formatDate(lastMessage?._creationTime || conversation._creationTime)}
                        </span>
                    </div>
                    <p className="text-[12px] mt-1 text-gray-500 flex items-center gap-1 ">
                        {lastMessage?.sender === me?._id ? <MessageSeenSvg /> : ""}
                        {conversation.isGroup && <Users size={16} />}
                        {!lastMessage && "Say Hi!"}
                        {lastMessageType === "text" && (
                            <span className="w-20 lg:w-32 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {lastMessage?.content}
                            </span>
                        )}
                        {lastMessageType === "image" && <ImageIcon size={16} />}
                        {lastMessageType === "video" && <VideoIcon size={16} />}
                    </p>
                </div>
            </div>
            <hr className="h-[1px] mx-3 bg-gray-primary" />
        </>
    );
}
