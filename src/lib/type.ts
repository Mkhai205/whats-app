export type lassMessageType = {
    _id: string;
    messageType: string;
    content: string;
    sender: string;
    _creationTime: number;
};

export type conversationsType = {
    _id: string;
    admin: string | null;
    isGroup: boolean;
    groupImage: string | null;
    groupName: string | null;
    participants: string[];
    _creationTime: number;
    lastMessage: lassMessageType | null;
    sender: string;
    isOnline: boolean;
};
