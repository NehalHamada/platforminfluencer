import { api } from "@/lib/axios";
import type {
  ConversationListResponse,
  MessageListResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat.types";

export const chatService = {
  async getConversations(): Promise<ConversationListResponse> {
    const response = await api.get("/api/conversations");
    return response.data;
  },

  async getMessages(conversationId: string | number): Promise<MessageListResponse> {
    const response = await api.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(data: SendMessagePayload): Promise<SendMessageResponse> {
    const response = await api.post("/api/messages/send", data);
    return response.data;
  },
};
