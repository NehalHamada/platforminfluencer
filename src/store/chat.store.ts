import type { ChatStore } from "@/types/chat.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      message: [],
      setMessages: (msg) => set({ message: msg }),
      addMessage: (msg) =>
        set((state) => ({
          message: [...state.message, msg],
        })),
    }),
    {
      name: "chat-storage",
    }
  )
);
