import { Doc } from "../../convex/_generated/dataModel";

export type UserType = Doc<"users">;

export type MessageType = Doc<"messages">;

export type ConversationType = Doc<"conversations">;

export type ConversationWithDetails = ConversationType & {
    lastMessage: MessageType | null;
    name?: string;
    email?: string;
    image?: string;
    tokenIdentifier?: string;
    isOnline?: boolean;
};

export interface IMessage {
    _id: string;
    content: string;
    _creationTime: number;
    messageType: "text" | "image" | "video";
    sender: UserType;
}
