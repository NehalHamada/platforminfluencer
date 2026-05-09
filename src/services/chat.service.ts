import { api } from "@/lib/axios";
import type {
  ConversationListResponse,
  MessageListResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat.types";

type ApiObject = Record<string, unknown>;

type BackendSendMessagePayload = {
  conversation_id?: string | number;
  message: string;
  type: SendMessagePayload["type"];
  delivery_date?: string;
  media_url?: string;
  notes?: string;
};

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getListFromResponse = (responseData: unknown): unknown[] => {
  if (Array.isArray(responseData)) return responseData;
  if (!isObject(responseData)) return [];

  const data = responseData.data;

  if (Array.isArray(data)) return data;
  if (isObject(data) && Array.isArray(data.data)) return data.data;
  if (isObject(data) && Array.isArray(data.conversations)) {
    return data.conversations;
  }
  if (isObject(data) && Array.isArray(data.messages)) return data.messages;
  if (Array.isArray(responseData.conversations)) {
    return responseData.conversations;
  }
  if (Array.isArray(responseData.messages)) return responseData.messages;

  return [];
};

const cleanMessagePayload = (
  data: SendMessagePayload,
): BackendSendMessagePayload => {
  const payload: Partial<BackendSendMessagePayload> = {
    conversation_id: data.conversation_id,
    message: data.message,
    type: data.type,
    delivery_date: data.delivery_date ?? undefined,
    media_url: data.media_url ?? undefined,
    notes: data.notes ?? undefined,
  };

  if (payload.type === "text") {
    delete payload.delivery_date;
    delete payload.media_url;
    delete payload.notes;
  }

  Object.keys(payload).forEach((key) => {
    const payloadKey = key as keyof BackendSendMessagePayload;
    if (payload[payloadKey] === null || payload[payloadKey] === undefined) {
      delete payload[payloadKey];
    }
  });

  return payload as BackendSendMessagePayload;
};

export const chatService = {
  async getConversations(): Promise<ConversationListResponse> {
    const response = await api.get("/api/conversations");
    return {
      ...(isObject(response.data) ? response.data : { success: true }),
      data: getListFromResponse(response.data),
    } as ConversationListResponse;
  },

  async getMessages(conversationId: string | number): Promise<MessageListResponse> {
    const response = await api.get(`/api/conversations/${conversationId}/messages`);
    return {
      ...(isObject(response.data) ? response.data : { success: true }),
      data: getListFromResponse(response.data),
    } as MessageListResponse;
  },

  async sendMessage(data: SendMessagePayload): Promise<SendMessageResponse> {
    const response = await api.post("/api/messages/send", cleanMessagePayload(data));
    return response.data;
  },
};
