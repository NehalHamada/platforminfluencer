import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ConvertCampaignFormData } from "@/types/dashboard.types";
import type { Conversation, Message } from "@/types/chat.types";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { useMessagesQuery } from "@/queries/chat/useMessagesQuery";
import { useSendMessageMutation } from "@/queries/chat/useSendMessagesMutation";
import { useAuthStore } from "@/store/auth.store";
import type { AuthStore } from "@/types/auth.types";

import MessageThread from "./MessageThread";

export type ChatMessage = {
  id: string;
  sender: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  time: string;
  type?: "text" | "agreement";
  agreement?: ConvertCampaignFormData;
};

export type ChatConversation = {
  id: string;
  name: string;
  avatar: string;
  roleLabel: string;
  campaignName: string;
  campaignBudget: string;
  category: string;
  status: string;
  lastMessage: string;
  lastActive: string;
  unreadCount: number;
  messages: ChatMessage[];
};

type ChatPageProps = {
  role: "company" | "influencer";
  initialMessage?: string;
};

const defaultAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

const getAvatar = (user: Record<string, unknown> | null | undefined) => {
  if (!user) return defaultAvatar;
  return getString(
    user.avatar ?? user.image ?? user.profile_image,
    defaultAvatar,
  );
};

function mapApiConversation(
  conv: Conversation,
  currentUserId: number | undefined,
  t: TFunction,
  isRTL: boolean,
): ChatConversation {
  // Determine the "other" participant
  const otherUser =
    conv.influencer ?? conv.company ?? conv.participant ?? conv.other_user;
  const otherObj =
    otherUser && typeof otherUser === "object"
      ? (otherUser as Record<string, unknown>)
      : null;

  const otherName = getString(
    otherObj?.name,
    isRTL ? "مستخدم" : "User",
  );

  const messagesFromApi = (conv.messages ?? []).map((msg) =>
    mapApiMessage(msg, currentUserId, otherName, otherObj),
  );

  return {
    id: String(conv.id),
    name: otherName,
    avatar: getAvatar(otherObj),
    roleLabel: conv.status
      ? t(`chat.status.${conv.status}`, conv.status)
      : t("chat.mock.company.influencerRole", "مؤثر"),
    campaignName: getString(
      conv.campaign_name ?? conv.campaignName ?? conv.name ?? conv.title,
      isRTL ? "حملة" : "Campaign",
    ),
    campaignBudget: getString(
      conv.campaign_budget ?? conv.campaignBudget,
      "",
    )
      ? `${isRTL ? "الميزانية" : "Budget"} ${getString(conv.campaign_budget ?? conv.campaignBudget)}`
      : "",
    category: getString(conv.category, ""),
    status: getString(conv.status, ""),
    lastMessage: getString(conv.last_message ?? conv.lastMessage, ""),
    lastActive: getString(conv.last_active ?? conv.lastActive, ""),
    unreadCount: Number(conv.unread_count ?? conv.unreadCount ?? 0),
    messages: messagesFromApi,
  };
}

function mapApiMessage(
  msg: Message,
  currentUserId: number | undefined,
  otherName: string,
  otherObj: Record<string, unknown> | null,
): ChatMessage {
  const isMine =
    currentUserId !== undefined && String(msg.sender_id) === String(currentUserId);

  const time = msg.created_at
    ? new Date(msg.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return {
    id: String(msg.id),
    sender: isMine ? "me" : "other",
    name: isMine ? "Me" : otherName,
    avatar: isMine ? "" : getAvatar(otherObj),
    text: msg.message ?? "",
    time,
    type: "text",
  };
}

function ChatPage({ role, initialMessage }: ChatPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const currentUser = useAuthStore((s: AuthStore) => s.user);
  const currentUserId = currentUser?.id;
  const location = useLocation();
  const stateLocation = location.state as { 
    conversationId?: string | number; 
    isNew?: boolean; 
    companyName?: string; 
  } | null;
  const stateConvId = stateLocation?.conversationId;
  const isNewConv = stateLocation?.isNew;
  const stateCompanyName = stateLocation?.companyName;

  // ─── Fetch conversations ───
  const conversationsQuery = useConversationsQuery();
  const apiConversations = useMemo(
    () => conversationsQuery.data?.data ?? [],
    [conversationsQuery.data?.data]
  );

  // ─── Selected conversation ───
  const [selectedConvIdState] = useState<string | number | undefined>(stateConvId);
  
  // Auto-select first conversation if none is manually selected
  const selectedConvId = selectedConvIdState ?? (apiConversations.length > 0 ? apiConversations[0].id : undefined);

  // ─── Fetch messages for selected conversation ───
  const messagesQuery = useMessagesQuery(selectedConvId);
  const apiMessages = useMemo(
    () => messagesQuery.data?.data ?? [],
    [messagesQuery.data?.data]
  );

  // ─── Send message mutation ───
  const sendMutation = useSendMessageMutation(selectedConvId, currentUserId);

  // ─── Build the selected conversation object ───
  const selectedConversation = useMemo<ChatConversation | undefined>(() => {
    const conv = apiConversations.find(
      (c) => String(c.id) === String(selectedConvId),
    );
    
    if (!conv && isNewConv) {
      return {
        id: String(selectedConvId),
        campaignName: stateCompanyName || "New Conversation",
        companyName: stateCompanyName || "Company",
        influencerName: currentUser?.name || "Influencer",
        category: "",
        status: "active",
        lastMessage: "",
        lastActive: "",
        unreadCount: 0,
        name: stateCompanyName || "Company",
        avatar: "",
        roleLabel: "",
        campaignBudget: "",
        messages: apiMessages.map((msg) =>
          mapApiMessage(msg, currentUserId, stateCompanyName || "Company", null),
        ),
      };
    }

    if (!conv) return undefined;

    const mapped = mapApiConversation(conv, currentUserId, t, isRTL);

    // Determine the other user for message mapping
    const otherUser =
      conv.influencer ?? conv.company ?? conv.participant ?? conv.other_user;
    const otherObj =
      otherUser && typeof otherUser === "object"
        ? (otherUser as Record<string, unknown>)
        : null;
    const otherName = getString(otherObj?.name, isRTL ? "مستخدم" : "User");

    // Override messages with the fresh per-conversation messages
    mapped.messages = apiMessages.map((msg) =>
      mapApiMessage(msg, currentUserId, otherName, otherObj),
    );

    return mapped;
  }, [apiConversations, selectedConvId, isNewConv, stateCompanyName, currentUser, apiMessages, currentUserId, t, isRTL]);

  // ─── Handle sending a message ───
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!selectedConvId) return;

      sendMutation.mutate({
        message: text,
        type: "text",
        delivery_date: null,
        media_url: null,
        notes: null,
      });
    },
    [selectedConvId, sendMutation],
  );

  // ─── Auto-send initial message (from ContactInfluencer) ───
  const initialSentRef = useRef(false);
  useEffect(() => {
    if (initialMessage && selectedConvId && !initialSentRef.current) {
      handleSendMessage(initialMessage);
      initialSentRef.current = true;
    }
  }, [initialMessage, selectedConvId, handleSendMessage]);

  // ─── Agreement submit (convert campaign popup) ───
  const handleAgreementSubmit = (data: ConvertCampaignFormData) => {
    // For now, send the agreement as a text summary
    const summaryText = [
      data.contentNotes,
      data.finalPrice,
      data.deliverablesCount,
      data.deliveryDate,
      data.agreementTerms,
    ]
      .filter(Boolean)
      .join(" | ");

    if (selectedConvId && summaryText) {
      sendMutation.mutate({
        message: summaryText,
        type: "text",
        delivery_date: null,
        media_url: null,
        notes: null,
      });
    }
  };

  // ─── Loading state ───
  if (conversationsQuery.isLoading) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
      </main>
    );
  }

  // ─── Empty state — no conversations yet ───
  if (!selectedConversation) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-[60vh] items-center justify-center px-0 pt-0"
        aria-labelledby="chat-page-title">
        <Card className="mx-auto border-0 bg-transparent py-0 shadow-none ring-0">
          <CardHeader className="px-0">
            <h1
              id="chat-page-title"
              className="text-center text-base font-medium text-[#707068]">
              {t("chat.empty", "لا توجد محادثات حاليا")}
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 px-0 pt-4">
            <p className="text-sm text-[#a3a694]">
              {role === "company"
                ? t(
                    "chat.emptyCompany",
                    "تواصل مع مؤثر أو أنشئ حملة لبدء محادثة",
                  )
                : t(
                    "chat.emptyInfluencer",
                    "قم بالتقدم لحملة أو انتظر تواصل شركة معك",
                  )}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-0 pt-0"
      aria-labelledby="chat-page-title">
      <Card className="mx-auto border-0 bg-transparent py-0 shadow-none ring-0">
        <CardHeader className="sr-only px-0">
          <h1 id="chat-page-title" className="text-base font-medium">
            {selectedConversation.campaignName}
          </h1>
        </CardHeader>

        <CardContent className="px-0">
          <div className="sr-only" aria-live="polite">
            {selectedConversation.lastMessage}
          </div>

          <MessageThread
            conversation={selectedConversation}
            isRTL={isRTL}
            onAgreementSubmit={handleAgreementSubmit}
            onSendMessage={handleSendMessage}
            isSending={sendMutation.isPending}
            isLoadingMessages={messagesQuery.isLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default ChatPage;
