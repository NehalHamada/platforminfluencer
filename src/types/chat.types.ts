export type Conversation = {
  id: string;
  participantName: string;
  participantImage?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type ConversationListResponse = {
  message?: string;
  data: Conversation[];
  total?: number;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "company" | "influencer";
  content: string;
  createdAt: string;
  isRead?: boolean;
};

export type MessageListResponse = {
  message?: string;
  data: Message[];
  total?: number;
};

export type SendMessagePayload = {
  conversationId: string;
  content: string;
};

export type SendMessageResponse = {
  message: string;
  data: Message;
};

export type ChatStore = {
  selectedConversationId: string | null;
  draftMessage: string;
  searchTerm: string;
  isChatSidebarOpen: boolean;
  setSelectedConversationId: (id: string | null) => void;
  setDraftMessage: (value: string) => void;
  setSearchTerm: (value: string) => void;
  openChatSidebar: () => void;
  closeChatSidebar: () => void;
  resetChatState: () => void;
};
