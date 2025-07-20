import { ConversationWithDetails } from "@/lib/type";
import { create } from "zustand";

type ConversationStore = {
    selectedConversation: ConversationWithDetails | null;
    setSelectedConversation: (conversation: ConversationWithDetails | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));
