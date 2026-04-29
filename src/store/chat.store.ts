import type { ChatStore } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set) => ({
  selectedConversationId: null,
  draftMessage: "",
  searchTerm: "",
  isChatSidebarOpen: false,

  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  setDraftMessage: (value) => set({ draftMessage: value }),
  setSearchTerm: (value) => set({ searchTerm: value }),
  openChatSidebar: () => set({ isChatSidebarOpen: true }),
  closeChatSidebar: () => set({ isChatSidebarOpen: false }),

  resetChatState: () =>
    set({
      selectedConversationId: null,
      draftMessage: "",
      searchTerm: "",
      isChatSidebarOpen: false,
    }),
}));
