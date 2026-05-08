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
import hero from "/assets/Hero.png";

export type ChatMessage = {
  id: string;
  conversationId?: string;
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

const getObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const getCompanyDisplayName = (
  conv: Conversation,
  companyObj: Record<string, unknown> | null,
  fallbackPeerName: string | undefined,
  isRTL: boolean,
) => {
  const rawConv = conv as Record<string, unknown>;
  const companyProfile = getObject(
    companyObj?.company_profile ?? companyObj?.profile,
  );
  const campaign = getObject(rawConv.campaign);
  const campaignUser = getObject(campaign?.user);

  return (
    getString(companyObj?.company_name) ||
    getString(companyObj?.brand_name) ||
    getString(companyObj?.business_name) ||
    getString(companyObj?.commercial_name) ||
    getString(companyProfile?.company_name) ||
    getString(companyProfile?.brand_name) ||
    getString(rawConv.company_name) ||
    getString(rawConv.companyName) ||
    getString(rawConv.brand_name) ||
    getString(campaign?.company_name) ||
    getString(campaign?.brand_name) ||
    getString(campaignUser?.company_name) ||
    getString(campaignUser?.brand_name) ||
    fallbackPeerName ||
    (isRTL ? "الشركة" : "Company")
  );
};

const getCompanyAvatar = (
  conv: Conversation,
  companyObj: Record<string, unknown> | null,
) => {
  const rawConv = conv as Record<string, unknown>;
  const companyProfile = getObject(
    companyObj?.company_profile ?? companyObj?.profile,
  );
  const campaign = getObject(rawConv.campaign);
  const campaignUser = getObject(campaign?.user);

  return (
    getString(companyObj?.logo) ||
    getString(companyObj?.company_logo) ||
    getString(companyObj?.brand_logo) ||
    getString(companyProfile?.logo) ||
    getString(companyProfile?.company_logo) ||
    getString(rawConv.company_logo) ||
    getString(rawConv.logo) ||
    getString(campaign?.company_logo) ||
    getString(campaignUser?.logo) ||
    getString(campaignUser?.company_logo) ||
    defaultAvatar
  );
};

const getMessageSenderCompany = (message: Message) => {
  const rawMessage = message as Record<string, unknown>;
  const sender = getObject(rawMessage.sender);
  const senderCompany =
    getObject(sender?.company) ??
    getObject(sender?.company_profile) ??
    getObject(sender?.profile);

  return {
    sender,
    company: senderCompany,
  };
};

const getMessageSenderId = (message: Message) => {
  const rawMessage = message as Record<string, unknown>;
  const sender = getObject(rawMessage.sender);

  return (
    message.sender_id ??
    rawMessage.user_id ??
    rawMessage.senderId ??
    rawMessage.from_user_id ??
    sender?.id
  );
};

const getCompanyHeaderFromMessages = (
  messages: Message[],
  currentUserId: number | undefined,
  isRTL: boolean,
) => {
  for (const message of messages) {
    const senderId = getMessageSenderId(message);

    if (
      currentUserId !== undefined &&
      senderId !== undefined &&
      String(senderId) === String(currentUserId)
    ) {
      continue;
    }

    const { sender, company } = getMessageSenderCompany(message);
    const name =
      getString(company?.company_name) ||
      getString(company?.brand_name) ||
      getString(company?.business_name) ||
      getString(company?.commercial_name) ||
      getString(sender?.company_name) ||
      getString(sender?.brand_name);

    const avatar =
      getString(company?.logo) ||
      getString(company?.company_logo) ||
      getString(company?.brand_logo) ||
      getString(sender?.logo) ||
      getString(sender?.company_logo) ||
      getString(sender?.brand_logo);

    if (name || avatar) {
      return {
        name: name || (isRTL ? "الشركة" : "Company"),
        avatar: avatar || defaultAvatar,
        sender,
      };
    }
  }

  return null;
};

const getUserObject = (value: unknown): Record<string, unknown> | null =>
  getObject(value);

const isSameUser = (
  user: Record<string, unknown> | null,
  currentUserId: number | undefined,
) =>
  currentUserId !== undefined &&
  (typeof user?.id === "string" || typeof user?.id === "number") &&
  String(user.id) === String(currentUserId);

const pickPeerUser = (
  conv: Conversation,
  currentUserId: number | undefined,
  role: "company" | "influencer",
) => {
  const preferred =
    role === "company"
      ? [
          getUserObject(conv.influencer),
          getUserObject(conv.participant),
          getUserObject(conv.other_user),
          getUserObject(conv.company),
        ]
      : [
          getUserObject(conv.company),
          getUserObject(conv.participant),
          getUserObject(conv.other_user),
          getUserObject(conv.influencer),
        ];

  return (
    preferred.find((user) => user && !isSameUser(user, currentUserId)) ??
    preferred.find(Boolean) ??
    null
  );
};

const getRealtimeConversation = (value: unknown): Conversation | undefined => {
  const payload = getObject(value);
  if (!payload) return undefined;

  const candidates = [
    payload.conversation,
    payload.chat,
    getObject(payload.data)?.conversation,
    getObject(payload.data)?.chat,
    getObject(payload.data)?.conversation_id ? payload.data : undefined,
  ];

  for (const candidate of candidates) {
    const conversation = getObject(candidate);
    const id = conversation?.id ?? conversation?.conversation_id;

    if (typeof id === "string" || typeof id === "number") {
      return {
        ...conversation,
        id,
      } as Conversation;
    }
  }

  return undefined;
};

const upsertConversation = (
  conversations: Conversation[],
  conversation: Conversation,
) => {
  const index = conversations.findIndex(
    (item) => String(item.id) === String(conversation.id),
  );

  if (index === -1) return [conversation, ...conversations];

  const next = [...conversations];
  next[index] = {
    ...next[index],
    ...conversation,
  };

  return next;
};

function mapApiConversation(
  conv: Conversation,
  currentUserId: number | undefined,
  t: TFunction,
  isRTL: boolean,
  role: "company" | "influencer",
  fallbackPeerName?: string,
): ChatConversation {
  const otherObj = pickPeerUser(conv, currentUserId, role);

  const otherName =
    getString(otherObj?.company_name) ||
    getString(otherObj?.name) ||
    fallbackPeerName ||
    (isRTL ? "مستخدم" : "User");

  const displayName =
    role === "influencer"
      ? getCompanyDisplayName(conv, otherObj, fallbackPeerName, isRTL)
      : otherName;

  const messagesFromApi = (conv.messages ?? []).map((msg) =>
    mapApiMessage(msg, currentUserId, displayName, otherObj),
  );

  return {
    id: String(conv.id),
    name: displayName,
    avatar:
      role === "influencer"
        ? getCompanyAvatar(conv, otherObj)
        : getAvatar(otherObj),
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
  const senderId = getMessageSenderId(msg);
  const isMine =
    currentUserId !== undefined &&
    String(senderId) === String(currentUserId);

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

const mergeApiAndLocalMessages = (
  apiMessages: ChatMessage[],
  localMessages: ChatMessage[],
  conversationId?: string | number,
) => {
  const apiMessageKeys = new Set(
    apiMessages.map((message) => `${message.sender}::${message.text ?? ""}`),
  );
  const scopedLocalMessages = conversationId
    ? localMessages.filter(
        (message) =>
          !message.conversationId ||
          String(message.conversationId) === String(conversationId),
      )
    : localMessages;

  return [
    ...apiMessages,
    ...scopedLocalMessages.filter(
      (message) =>
        !apiMessageKeys.has(`${message.sender}::${message.text ?? ""}`),
    ),
  ];
};

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
    stateConvId ??
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

  useEffect(() => {
    if (!currentUserId) return;

    const channelName = `user.${currentUserId}`;
    const channel = pusher.subscribe(channelName);
    const handleRealtimeEvent = (eventName: string, data: unknown) => {
      if (eventName.startsWith("pusher:")) return;

      const conversation = getRealtimeConversation(data);

      if (conversation) {
        queryClient.setQueryData(
          queryKeys.chat.conversations(),
          (oldData: unknown) => {
            const oldResponse = getObject(oldData);
            const oldConversations = Array.isArray(oldResponse?.data)
              ? (oldResponse.data as Conversation[])
              : [];

            return {
              ...(oldResponse ?? { success: true }),
              data: upsertConversation(oldConversations, conversation),
            };
          },
        );
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "collaboration-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "company-collaboration-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.myApplications(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.allApplications(),
      });
    };

    channel.bind_global(handleRealtimeEvent);

    return () => {
      channel.unbind_global(handleRealtimeEvent);
      pusher.unsubscribe(channelName);
    };
  }, [currentUserId, queryClient]);

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
        messages: mergeApiAndLocalMessages(
          apiMessages.map((msg) =>
            mapApiMessage(msg, currentUserId, statePeerName || "Company", null),
          ),
          pendingMessages,
          selectedConvId,
        ),
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
    const messageCompanyHeader =
      role === "influencer"
        ? getCompanyHeaderFromMessages(apiMessages, currentUserId, isRTL)
        : null;

    if (messageCompanyHeader) {
      mapped.name = messageCompanyHeader.name;
      mapped.avatar = messageCompanyHeader.avatar;
    }

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
    mapped.messages = mergeApiAndLocalMessages(
      apiMessages.map((msg) =>
        mapApiMessage(
          msg,
          currentUserId,
          messageCompanyHeader?.name || otherName,
          messageCompanyHeader?.sender || otherObj,
        ),
      ),
      pendingMessages,
      selectedConvId,
    );

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
        conversationId: selectedConvId ? String(selectedConvId) : undefined,
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
      setPendingMessages((messages) => [...messages, tempMessage]);

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
          setPendingMessages((messages) =>
            messages.filter((message) => message.id !== tempMessage.id),
          );
          return false;
        }

        if (String(conversationId) === String(selectedConvId)) {
          await sendMutation.mutateAsync(payload);
        } else {
          await chatService.sendMessage({
            ...payload,
            conversation_id: conversationId,
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.chat.conversations(),
          });
        }

        return true;
      } catch (error) {
        console.error("Send message error:", error);
        setPendingMessages((messages) =>
          messages.filter((message) => message.id !== tempMessage.id),
        );
        return false;
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
        className="-mt-24 bg-[#f7f7f4]">
        <section className="relative h-48 w-full overflow-hidden sm:h-64">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </section>
        <section className="relative z-10 -mt-10 flex min-h-[50vh] items-center justify-center rounded-t-[28px] bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
        </section>
      </main>
    );
  }

  // ─── Empty state — no conversations yet ───
  if (!selectedConversation) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="-mt-24 bg-[#f7f7f4]"
        aria-labelledby="chat-page-title">
        <section className="relative h-48 w-full overflow-hidden sm:h-64">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </section>
        <section className="relative z-10 -mt-10 rounded-t-[28px] bg-white px-4 py-20">
        <Card className="mx-auto max-w-3xl border-0 bg-transparent py-0 text-center shadow-none ring-0">
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
        </section>
      </main>
    );
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="-mt-24 bg-[#f7f7f4]"
      aria-labelledby="chat-page-title">
      <section className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-72">
        <img
          src={hero}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
      </section>

      <section className="relative z-10 -mt-10 rounded-t-[28px] bg-white px-2 pb-8 pt-4 sm:-mt-12 sm:rounded-t-[34px] sm:px-6 sm:pb-12 sm:pt-7 lg:px-10">
      <Card className="mx-auto max-w-5xl overflow-hidden rounded-[22px] border border-[#f2f0e8] bg-white py-0 shadow-[0_16px_45px_rgba(26,28,23,0.06)] ring-0 sm:rounded-[28px]">
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
      </section>
    </main>
  );
}

export default ChatPage;
