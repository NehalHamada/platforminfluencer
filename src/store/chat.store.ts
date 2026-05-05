import type { ChatStore } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set) => ({
  message: [],
  setMessages: (msg) => set({ message: msg }),
  addMessage: (msg) =>
    set((state) => ({
      message: [...state.message, msg],
    })),
}));
