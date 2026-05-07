import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { queryKeys } from "@/constants/queryKeys";
import type { ConvertCampaignFormData } from "@/types/dashboard.types";
import type { Conversation, Message } from "@/types/chat.types";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { useMessagesQuery } from "@/queries/chat/useMessagesQuery";
import { useSendMessageMutation } from "@/queries/chat/useSendMessagesMutation";
import { useAuthStore } from "@/store/auth.store";
import type { AuthStore } from "@/types/auth.types";
import { chatService } from "@/services/chat.service";
import { resolveAcceptedConversationId } from "@/utils/chat";

import { pusher } from "@/lib/pusher";
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
  extraConversations?: Conversation[];
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
  role: "company" | "influencer",
  fallbackPeerName?: string,
): ChatConversation {
  const otherUser =
    role === "company"
      ? (conv.influencer ?? conv.participant ?? conv.other_user ?? conv.company)
      : (conv.company ??
        conv.participant ??
        conv.other_user ??
        conv.influencer);
  const otherObj =
    otherUser && typeof otherUser === "object"
      ? (otherUser as Record<string, unknown>)
      : null;

  const otherName =
    getString(otherObj?.company_name) ||
    getString(otherObj?.name) ||
    fallbackPeerName ||
    (isRTL ? "مستخدم" : "User");

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
    campaignBudget: getString(conv.campaign_budget ?? conv.campaignBudget, "")
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
    currentUserId !== undefined &&
    String(msg.sender_id) === String(currentUserId);

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

function ChatPage({
  role,
  initialMessage,
  extraConversations = [],
}: ChatPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s: AuthStore) => s.user);
  const currentUserId = currentUser?.id;
  const location = useLocation();
  const stateLocation = location.state as {
    conversationId?: string | number;
    isNew?: boolean;
    companyName?: string;
    peerName?: string;
    campaignName?: string;
  } | null;
  const stateConvId = stateLocation?.conversationId;
  const isNewConv = stateLocation?.isNew;
  const statePeerName = stateLocation?.peerName ?? stateLocation?.companyName;
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // ─── Fetch conversations ───
  const conversationsQuery = useConversationsQuery();
  const apiConversations = useMemo(() => {
    const conversations = conversationsQuery.data?.data ?? [];
    const seenIds = new Set(
      conversations.map((conversation) => String(conversation.id)),
    );
    const fallbackConversations = extraConversations.filter(
      (conversation) => !seenIds.has(String(conversation.id)),
    );

    return [...conversations, ...fallbackConversations];
  }, [conversationsQuery.data?.data, extraConversations]);

  // ─── Selected conversation ───
  const [selectedConvIdState] = useState<string | number | undefined>(
    stateConvId,
  );

  const peerConversation = useMemo(() => {
    if (!statePeerName) return undefined;
    const normalizedPeer = statePeerName.trim().toLowerCase();

    return apiConversations.find((conv) => {
      const mapped = mapApiConversation(
        conv,
        currentUserId,
        t,
        isRTL,
        role,
        statePeerName,
      );

      return mapped.name.trim().toLowerCase() === normalizedPeer;
    });
  }, [apiConversations, currentUserId, isRTL, role, statePeerName, t]);

  // Auto-select first conversation if none is manually selected
  const selectedConvId =
    selectedConvIdState ??
    peerConversation?.id ??
    (statePeerName
      ? undefined
      : apiConversations.length > 0
        ? apiConversations[0].id
        : undefined);

  // ─── Fetch messages for selected conversation ───
  const messagesQuery = useMessagesQuery(selectedConvId);
  const apiMessages = useMemo(
    () => messagesQuery.data?.data ?? [],
    [messagesQuery.data?.data],
  );

  // ─── Pusher Real-time Integration ───
  useEffect(() => {
    if (!selectedConvId) return;

    const channelName = `conversation.${selectedConvId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("MessageSent", (data: { message?: Message }) => {
      const newMessage = data.message || (data as unknown as Message);
      
      // Don't add if it's my own message (already handled by mutation/optimistic UI)
      if (currentUserId !== undefined && String(newMessage.sender_id) === String(currentUserId)) {
        return;
      }

      // Update the react-query cache for messages
      queryClient.setQueryData(
        queryKeys.chat.messages(selectedConvId),
        (oldData: any) => {
          if (!oldData) return { success: true, data: [newMessage] };
          return {
            ...oldData,
            data: [...(oldData.data || []), newMessage],
          };
        }
      );
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [selectedConvId, currentUserId, queryClient]);

  // ─── Send message mutation ───
  const sendMutation = useSendMessageMutation(selectedConvId, currentUserId);

  // ─── Build the selected conversation object ───
  const selectedConversation = useMemo<ChatConversation | undefined>(() => {
    const conv = apiConversations.find(
      (c) => String(c.id) === String(selectedConvId),
    );

    if (!conv && (isNewConv || statePeerName)) {
      return {
        id: String(
          selectedConvId ?? `pending-${statePeerName ?? "conversation"}`,
        ),
        campaignName:
          stateLocation?.campaignName || statePeerName || "New Conversation",
        category: "",
        status: selectedConvId ? "active" : "pending",
        lastMessage: "",
        lastActive: "",
        unreadCount: 0,
        name: statePeerName || "Company",
        avatar: "",
        roleLabel: "",
        campaignBudget: "",
        messages: [
          ...apiMessages.map((msg) =>
            mapApiMessage(msg, currentUserId, statePeerName || "Company", null),
          ),
          ...pendingMessages,
        ],
      };
    }

    if (!conv) return undefined;

    const mapped = mapApiConversation(
      conv,
      currentUserId,
      t,
      isRTL,
      role,
      statePeerName,
    );

    // Determine the other user for message mapping
    const otherUser =
      role === "company"
        ? (conv.influencer ??
          conv.participant ??
          conv.other_user ??
          conv.company)
        : (conv.company ??
          conv.participant ??
          conv.other_user ??
          conv.influencer);
    const otherObj =
      otherUser && typeof otherUser === "object"
        ? (otherUser as Record<string, unknown>)
        : null;
    const otherName =
      getString(otherObj?.company_name) ||
      getString(otherObj?.name) ||
      statePeerName ||
      (isRTL ? "مستخدم" : "User");

    // Override messages with the fresh per-conversation messages
    mapped.messages = [
      ...apiMessages.map((msg) =>
        mapApiMessage(msg, currentUserId, otherName, otherObj),
      ),
      ...pendingMessages,
    ];

    return mapped;
  }, [
    apiConversations,
    selectedConvId,
    isNewConv,
    statePeerName,
    stateLocation?.campaignName,
    apiMessages,
    pendingMessages,
    currentUserId,
    t,
    isRTL,
    role,
  ]);

  // ─── Handle sending a message ───
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isSendingMessage) return false;
      setIsSendingMessage(true);

      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        sender: "me",
        name: "Me",
        avatar: "",
        text,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        type: "text",
      };
      const shouldShowPending = !selectedConvId;

      if (shouldShowPending) {
        setPendingMessages((messages) => [...messages, tempMessage]);
      }

      try {
        const conversationId =
          selectedConvId ??
          (await resolveAcceptedConversationId({
            queryClient,
            role,
            peerName: statePeerName,
          }));

        const payload = {
          message: text,
          type: "text",
          delivery_date: null,
          media_url: null,
          notes: null,
        } as const;

        if (!conversationId) {
          return true;
        }

        if (String(conversationId) === String(selectedConvId)) {
          sendMutation.mutate(payload);
        } else {
          await chatService.sendMessage({
            ...payload,
            conversation_id: conversationId,
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.chat.messages(conversationId),
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.chat.conversations(),
          });
          setPendingMessages((messages) =>
            messages.filter((message) => message.id !== tempMessage.id),
          );
        }

        return true;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      isSendingMessage,
      selectedConvId,
      sendMutation,
      queryClient,
      role,
      statePeerName,
    ],
  );

  // ─── Auto-send initial message (from ContactInfluencer) ───
  const initialSentRef = useRef(false);
  useEffect(() => {
    if (
      initialMessage &&
      selectedConvId &&
      (stateConvId || statePeerName) &&
      !initialSentRef.current
    ) {
      handleSendMessage(initialMessage);
      initialSentRef.current = true;
    }
  }, [
    initialMessage,
    selectedConvId,
    stateConvId,
    statePeerName,
    handleSendMessage,
  ]);

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
        type: "agreement",
        delivery_date: data.deliveryDate || null,
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
            role={role}
            isRTL={isRTL}
            onAgreementSubmit={handleAgreementSubmit}
            onSendMessage={handleSendMessage}
            isSending={sendMutation.isPending || isSendingMessage}
            isLoadingMessages={messagesQuery.isLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default ChatPage;
