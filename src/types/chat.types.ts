export type MessageType =
  | "text"
  | "agreement"
  | "video_submission"
  | "content_delivery"
  | "image"
  | "file";

export type Message = {
  id: string | number;
  message?: string;
  sender_id?: string | number;
  type?: MessageType;
  delivery_date?: string | null;
  media_url?: string | null;
  notes?: string | null;
  created_at?: string | null;
  conversation_id?: string | number | null;
};

export type ChatApiUser = {
  id?: string | number;
  name?: string;
  company_name?: string;
  avatar?: string | null;
  image?: string | null;
  profile_image?: string | null;
};

export type Conversation = {
  id: string | number;
  campaign_id?: string | number | null;
  campaignId?: string | number | null;
  application_id?: string | number | null;
  applicationId?: string | number | null;
  name?: string;
  title?: string;
  campaign_name?: string;
  campaignName?: string;
  campaign_budget?: string | number | null;
  campaignBudget?: string | number | null;
  category?: string | null;
  status?: string | null;
  last_message?: string | null;
  lastMessage?: string | null;
  last_active?: string | null;
  lastActive?: string | null;
  unread_count?: number | string | null;
  unreadCount?: number | string | null;
  company?: ChatApiUser | Record<string, unknown> | null;
  influencer?: ChatApiUser | Record<string, unknown> | null;
  participant?: ChatApiUser | Record<string, unknown> | null;
  other_user?: ChatApiUser | Record<string, unknown> | null;
  messages?: Message[];
};

export type ConversationListResponse = {
  success: boolean;
  data: Conversation[];
};

export type MessageListResponse = {
  success: boolean;
  data: Message[];
};

export type SendMessagePayload = {
  conversation_id?: string | number;
  message: string;
  type: MessageType;
  delivery_date?: string | null;
  media_url?: string | null;
  notes?: string | null;
};

export type SendMessageResponse = {
  success: boolean;
  data?: Message;
  message?: string;
};

export type ChatStore = {
  message: Message[];
  setMessages: (msg: Message[]) => void;
  addMessage: (msg: Message) => void;
};
