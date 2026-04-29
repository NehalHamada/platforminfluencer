import { api } from "@/lib/axios";
import type {
  ConversationListResponse,
  MessageListResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat.types";

export const chatService = {
  async getConversations(): Promise<ConversationListResponse> {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  async getMessages(conversationId: string): Promise<MessageListResponse> {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages`,
    );
    return response.data;
  },

  async sendMessage(data: SendMessagePayload): Promise<SendMessageResponse> {
    const response = await api.post(
      `/chat/conversations/${data.conversationId}/messages`,
      {
        content: data.content,
      },
    );

    return response.data;
  },
};
