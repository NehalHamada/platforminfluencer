import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
import { campaignService } from "@/services/campaign.service";
import { resolveAcceptedConversationId } from "@/utils/chat";
import { isClosedCampaignStatus } from "@/utils/campaignProgress";
import { getContentMessageMediaUrl } from "@/utils/completedCampaignSource";
import {
  isCompletedConversationId,
  saveCompletedCampaignEntry,
} from "@/utils/completedCampaigns";
import {
  getReviewAverage,
  saveInfluencerReview,
  type InfluencerReviewInput,
} from "@/utils/influencerReviews";
import { useCampaignStore } from "@/store/campaign.store";

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
  type?:
    | "text"
    | "agreement"
    | "agreement_status"
    | "content_delivery"
    | "content_approved"
    | "modification_request"
    | "modification_response";
  agreement?: ConvertCampaignFormData;
  agreement_status?: "pending" | "accepted" | "rejected";
  agreement_target_id?: string;
  media_url?: string | null;
  notes?: string | null;
  modification_reason_id?: string | number | null;
  modification_reason?: string | null;
  new_delivery_date?: string | null;
  description?: string | null;
  modification_id?: string | number | null;
  modification_status?: "pending" | "accepted" | "rejected";
  modification_target_id?: string;
};

export type ChatConversation = {
  id: string;
  campaignId?: string;
  applicationId?: string;
  influencerId?: string;
  companyId?: string;
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
const AGREEMENT_STATUS_PREFIX = "__agreement_status__:";
const MODIFICATION_REQUEST_PREFIX = "__modification_request__:";
const MODIFICATION_RESPONSE_PREFIX = "__modification_response__:";
const CONTENT_APPROVED_PREFIX = "__content_approved__";
const CONTENT_DELIVERY_PREFIX = "__content_delivery__:";

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

const getIdString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return "";
};

const getAvatar = (user: Record<string, unknown> | null | undefined) => {
  if (!user) return defaultAvatar;
  return getString(
    user.avatar ?? user.image ?? user.profile_image,
    defaultAvatar,
  );
};

const getObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const isContentApprovedConversationMessage = (message: unknown) => {
  const rawMessage = getObject(message);
  if (!rawMessage) return false;

  return (
    String(rawMessage.type ?? "") === "content_approved" ||
    String(rawMessage.message ?? "").indexOf(CONTENT_APPROVED_PREFIX) === 0
  );
};

const isClosedConversation = (conversation: Conversation) => {
  if (isCompletedConversationId(conversation.id)) return true;

  const rawConversation = conversation as Record<string, unknown>;
  const nestedApplication = getObject(rawConversation.application);
  const nestedRequest =
    getObject(rawConversation.collaboration_request) ??
    getObject(rawConversation.collaborationRequest) ??
    getObject(rawConversation.request);
  const nestedCampaign = getObject(rawConversation.campaign);

  const status =
    conversation.status ??
    (nestedApplication?.status as string | undefined) ??
    (nestedRequest?.status as string | undefined) ??
    (nestedCampaign?.status as string | undefined);

  if (isClosedCampaignStatus(status)) return true;

  const campaignId = String(rawConversation.campaign_id ?? rawConversation.campaignId ?? nestedCampaign?.id);
  const applicationId = String(rawConversation.application_id ?? rawConversation.applicationId ?? nestedApplication?.id ?? nestedRequest?.id);
  const rejectedIds = useCampaignStore.getState().rejectedCampaignIds;

  if (
    (campaignId && rejectedIds.includes(campaignId)) ||
    (applicationId && rejectedIds.includes(applicationId))
  ) {
    return true;
  }

  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
    : [];

  return (
    messages.some(isContentApprovedConversationMessage) ||
    String(conversation.last_message ?? conversation.lastMessage ?? "").indexOf(
      CONTENT_APPROVED_PREFIX,
    ) === 0
  );
};

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

const getConversationCampaignId = (conv: Conversation) => {
  const rawConv = conv as Record<string, unknown>;
  const campaign = getObject(rawConv.campaign);

  return getIdString(rawConv.campaign_id, rawConv.campaignId, campaign?.id);
};

const getConversationApplicationId = (conv: Conversation) => {
  const rawConv = conv as Record<string, unknown>;
  const application =
    getObject(rawConv.application) ??
    getObject(rawConv.campaign_application) ??
    getObject(rawConv.campaignApplication) ??
    getObject(rawConv.request);

  return getIdString(
    rawConv.application_id,
    rawConv.applicationId,
    rawConv.campaign_application_id,
    rawConv.campaignApplicationId,
    application?.id,
  );
};

const isApplicationVisibleInConversation = (
  application: { conversation_id?: string | number; status?: string },
  conversationId?: string | number,
) =>
  Boolean(
    application.conversation_id &&
      conversationId &&
      String(application.conversation_id) === String(conversationId),
  );

const isWorkableApplicationStatus = (status?: string) =>
  ["accepted", "modification_requested", "content_approved"].indexOf(
    String(status ?? "").toLowerCase(),
  ) !== -1;

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
    campaignId: getConversationCampaignId(conv),
    applicationId: getConversationApplicationId(conv),
    influencerId:
      role === "company"
        ? getIdString(otherObj?.id)
        : getIdString((conv.influencer as Record<string, unknown> | undefined)?.id),
    companyId:
      role === "influencer"
        ? getIdString(otherObj?.id)
        : getIdString((conv.company as Record<string, unknown> | undefined)?.id),
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
  const statusEvent = parseAgreementStatusMessage(msg.message ?? "");
  const modificationEvent = parseModificationRequestMessage(msg.message ?? "");
  const modificationResponseEvent = parseModificationResponseMessage(
    msg.message ?? "",
  );
  const contentApprovedEvent = isContentApprovedMessage(msg.message ?? "");
  const contentDeliveryEvent = parseContentDeliveryMessage(msg.message ?? "");

  if (statusEvent) {
    return {
      id: String(msg.id),
      sender: isMine ? "me" : "other",
      name: isMine ? "Me" : otherName,
      avatar: isMine ? "" : getAvatar(otherObj),
      text: "",
      time,
      type: "agreement_status",
      agreement_status: statusEvent.status,
      agreement_target_id: statusEvent.agreementId,
    };
  }

  if (modificationEvent) {
    return {
      id: String(msg.id),
      sender: isMine ? "me" : "other",
      name: isMine ? "Me" : otherName,
      avatar: isMine ? "" : getAvatar(otherObj),
      text: modificationEvent.description,
      time,
      type: "modification_request",
      modification_reason_id: modificationEvent.modification_reason_id,
      modification_reason: modificationEvent.modification_reason,
      new_delivery_date: modificationEvent.new_delivery_date,
      description: modificationEvent.description,
      modification_id: modificationEvent.modification_id,
      modification_status: modificationEvent.modification_status ?? "pending",
    };
  }

  if (modificationResponseEvent) {
    return {
      id: String(msg.id),
      sender: isMine ? "me" : "other",
      name: isMine ? "Me" : otherName,
      avatar: isMine ? "" : getAvatar(otherObj),
      text: "",
      time,
      type: "modification_response",
      modification_status: modificationResponseEvent.status,
      modification_target_id: modificationResponseEvent.modificationId,
    };
  }

  if (contentApprovedEvent) {
    return {
      id: String(msg.id),
      sender: isMine ? "me" : "other",
      name: isMine ? "Me" : otherName,
      avatar: isMine ? "" : getAvatar(otherObj),
      text: msg.message ?? "",
      time,
      type: "content_approved",
    };
  }

  if (contentDeliveryEvent) {
    return {
      id: String(msg.id),
      sender: isMine ? "me" : "other",
      name: isMine ? "Me" : otherName,
      avatar: isMine ? "" : getAvatar(otherObj),
      text: contentDeliveryEvent.message,
      time,
      type: "content_delivery",
      media_url: contentDeliveryEvent.media_url,
      notes: contentDeliveryEvent.notes,
    };
  }

  const isAgreement = msg.type === "agreement";
  const isContentDelivery =
    msg.type === "content_delivery" || msg.type === "video_submission";
  const agreement = isAgreement
    ? parseAgreementMessage(msg.message ?? "", msg.delivery_date ?? null)
    : undefined;
  const agreementStatus = isAgreement ? getAgreementStatus(msg) : undefined;

  return {
    id: String(msg.id),
    sender: isMine ? "me" : "other",
    name: isMine ? "Me" : otherName,
    avatar: isMine ? "" : getAvatar(otherObj),
    text: msg.message ?? "",
    time,
    type: isAgreement
      ? "agreement"
      : isContentDelivery
        ? "content_delivery"
        : "text",
    agreement,
    agreement_status: agreementStatus,
    media_url: msg.media_url,
    notes: msg.notes,
  };
}

const buildAgreementStatusMessage = (
  agreementId: string,
  status: "accepted" | "rejected",
) => `${AGREEMENT_STATUS_PREFIX}${agreementId}:${status}`;

type ModificationRequestPayload = {
  modification_reason_id: string | number;
  modification_reason?: string | null;
  new_delivery_date: string;
  description: string;
  modification_id?: string | number | null;
  modification_status?: "pending" | "accepted" | "rejected";
};

const buildModificationRequestMessage = (data: ModificationRequestPayload) =>
  `${MODIFICATION_REQUEST_PREFIX}${JSON.stringify(data)}`;

const parseModificationRequestMessage = (
  message: string,
): ModificationRequestPayload | null => {
  if (!message.startsWith(MODIFICATION_REQUEST_PREFIX)) return null;

  try {
    const parsed = JSON.parse(
      message.slice(MODIFICATION_REQUEST_PREFIX.length),
    ) as Partial<ModificationRequestPayload>;

    if (!parsed.new_delivery_date || !parsed.description) return null;

    return {
      modification_reason_id: parsed.modification_reason_id ?? 1,
      modification_reason: parsed.modification_reason ?? null,
      new_delivery_date: parsed.new_delivery_date,
      description: parsed.description,
      modification_id: parsed.modification_id ?? null,
      modification_status: parsed.modification_status ?? "pending",
    };
  } catch {
    return null;
  }
};

const buildModificationResponseMessage = (
  modificationId: string,
  status: "accepted" | "rejected",
) => `${MODIFICATION_RESPONSE_PREFIX}${modificationId}:${status}`;

const parseModificationResponseMessage = (
  message: string,
): { modificationId: string; status: "accepted" | "rejected" } | null => {
  if (!message.startsWith(MODIFICATION_RESPONSE_PREFIX)) return null;

  const payload = message.slice(MODIFICATION_RESPONSE_PREFIX.length);
  const [modificationId, status] = payload.split(":");

  if (
    !modificationId ||
    (status !== "accepted" && status !== "rejected")
  ) {
    return null;
  }

  return { modificationId, status };
};

const isContentApprovedMessage = (message: string) =>
  message.trim() === CONTENT_APPROVED_PREFIX;

const buildContentDeliveryMessage = (data: {
  media_url: string;
  message: string;
  notes: string;
}) => `${CONTENT_DELIVERY_PREFIX}${JSON.stringify(data)}`;

const parseContentDeliveryMessage = (
  message: string,
): { media_url: string; message: string; notes: string } | null => {
  if (!message.startsWith(CONTENT_DELIVERY_PREFIX)) return null;

  try {
    const parsed = JSON.parse(
      message.slice(CONTENT_DELIVERY_PREFIX.length),
    ) as Partial<{ media_url: string; message: string; notes: string }>;

    if (!parsed.media_url) return null;

    return {
      media_url: parsed.media_url,
      message: parsed.message ?? parsed.notes ?? "",
      notes: parsed.notes ?? parsed.message ?? "",
    };
  } catch {
    return null;
  }
};

const isLocalDeliveryUrl = (value?: string | null) =>
  String(value ?? "").startsWith("local-file://");

const parseAgreementStatusMessage = (
  message: string,
): { agreementId: string; status: "accepted" | "rejected" } | null => {
  if (!message.startsWith(AGREEMENT_STATUS_PREFIX)) return null;

  const payload = message.slice(AGREEMENT_STATUS_PREFIX.length);
  const [agreementId, status] = payload.split(":");

  if (
    !agreementId ||
    (status !== "accepted" && status !== "rejected")
  ) {
    return null;
  }

  return { agreementId, status };
};

const getAgreementStatus = (
  message: Message,
): "pending" | "accepted" | "rejected" => {
  const rawStatus = getString(
    (message as Record<string, unknown>).agreement_status ??
      (message as Record<string, unknown>).status,
    "pending",
  ).toLowerCase();

  if (rawStatus === "accepted" || rawStatus === "rejected") {
    return rawStatus;
  }

  return "pending";
};

const parseAgreementMessage = (
  message: string,
  deliveryDate: string | null,
): ConvertCampaignFormData => {
  const parts = message
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const getValue = (key: string) => {
    const prefix = `${key}:`;
    return (
      parts
        .find((part) => part.toLowerCase().startsWith(prefix))
        ?.slice(prefix.length)
        .trim() ?? ""
    );
  };

  const plainMessage =
    parts.find((part) => !part.includes(":")) || message.replace(/\|/g, " ");

  return {
    message: plainMessage.trim(),
    final_price: getValue("final_price"),
    deliverables_count: getValue("deliverables_count"),
    delivery_date: getValue("delivery_date") || deliveryDate || "",
    agreement_terms: true,
  };
};

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

  return applySystemStatusMessages([
    ...apiMessages,
    ...scopedLocalMessages.filter(
      (message) =>
        !apiMessageKeys.has(`${message.sender}::${message.text ?? ""}`),
    ),
  ]);
};

const applySystemStatusMessages = (messages: ChatMessage[]) => {
  const agreementStatuses = new Map<
    string,
    "accepted" | "rejected"
  >();
  const modificationStatuses = new Map<
    string,
    "accepted" | "rejected"
  >();

  messages.forEach((message) => {
    if (
      message.type === "agreement_status" &&
      message.agreement_target_id &&
      (message.agreement_status === "accepted" ||
        message.agreement_status === "rejected")
    ) {
      agreementStatuses.set(message.agreement_target_id, message.agreement_status);
    }

    if (
      message.type === "modification_response" &&
      message.modification_target_id &&
      (message.modification_status === "accepted" ||
        message.modification_status === "rejected")
    ) {
      modificationStatuses.set(
        message.modification_target_id,
        message.modification_status,
      );
    }
  });

  return messages
    .filter(
      (message) =>
        message.type !== "agreement_status" &&
        message.type !== "modification_response",
    )
    .map((message) => {
      if (message.type === "agreement") {
        return {
          ...message,
          agreement_status:
            agreementStatuses.get(message.id) ??
            message.agreement_status ??
            "pending",
        };
      }

      if (message.type === "modification_request") {
        const modificationId = getIdString(message.modification_id, message.id);

        return {
          ...message,
          modification_status:
            modificationStatuses.get(modificationId) ??
            message.modification_status ??
            "pending",
        };
      }

      return message;
    });
};

function ChatPage({
  role,
  initialMessage,
  extraConversations = [],
}: ChatPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s: AuthStore) => s.user);
  const currentUserId = currentUser?.id;
  const location = useLocation();
  const stateLocation = location.state as {
    conversationId?: string | number;
    isNew?: boolean;
    companyName?: string;
    peerName?: string;
    campaignName?: string;
    campaignId?: string | number;
    applicationId?: string | number;
    influencerId?: string | number;
    companyId?: string | number;
    campaignBudget?: string | number;
    category?: string;
  } | null;
  const stateConvId = stateLocation?.conversationId;
  const isNewConv = stateLocation?.isNew;
  const statePeerName = stateLocation?.peerName ?? stateLocation?.companyName;
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const approvedOnLoadRef = useRef<Record<string, boolean | undefined>>({});
  const agreementSubmitLockRef = useRef<string | null>(null);

  // ─── Fetch conversations ───
  const conversationsQuery = useConversationsQuery();
  const apiConversations = useMemo(() => {
    const conversations = conversationsQuery.data?.data ?? [];
    const fallbackById = new Map(
      extraConversations.map((conversation) => [
        String(conversation.id),
        conversation,
      ]),
    );
    const mergedConversations = conversations.map((conversation) => {
      const fallback = fallbackById.get(String(conversation.id));

      if (!fallback) return conversation;

      return {
        ...fallback,
        ...conversation,
        campaign_id: conversation.campaign_id ?? fallback.campaign_id,
        campaignId: conversation.campaignId ?? fallback.campaignId,
        application_id: conversation.application_id ?? fallback.application_id,
        applicationId: conversation.applicationId ?? fallback.applicationId,
        campaign_name: conversation.campaign_name ?? fallback.campaign_name,
        campaignName: conversation.campaignName ?? fallback.campaignName,
        campaign_budget:
          conversation.campaign_budget ?? fallback.campaign_budget,
        campaignBudget: conversation.campaignBudget ?? fallback.campaignBudget,
        category: conversation.category ?? fallback.category,
        company: conversation.company ?? fallback.company,
        influencer: conversation.influencer ?? fallback.influencer,
        participant: conversation.participant ?? fallback.participant,
        other_user: conversation.other_user ?? fallback.other_user,
      };
    });
    const seenIds = new Set(
      mergedConversations.map((conversation) => String(conversation.id)),
    );
    const fallbackConversations = extraConversations.filter(
      (conversation) => !seenIds.has(String(conversation.id)),
    );

    return [...mergedConversations, ...fallbackConversations].filter(
      (conversation) => !isClosedConversation(conversation),
    );
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

  const isPendingConversation = String(selectedConvId ?? "").startsWith("pending:");
  // ─── Fetch messages for selected conversation ───
  const messagesQuery = useMessagesQuery(isPendingConversation ? undefined : selectedConvId);
  const apiMessages = useMemo(
    () => messagesQuery.data?.data ?? [],
    [messagesQuery.data?.data],
  );
  const selectedClosedConversation = useMemo(() => {
    if (!selectedConvId) return undefined;

    return (conversationsQuery.data?.data ?? [])
      .concat(extraConversations)
      .find(
        (conversation) =>
          String(conversation.id) === String(selectedConvId) &&
          isClosedConversation(conversation),
      );
  }, [conversationsQuery.data?.data, extraConversations, selectedConvId]);
  const hasApprovedApiMessage = useMemo(
    () => apiMessages.some(isContentApprovedConversationMessage),
    [apiMessages],
  );
  const isSelectedCompletedChat = Boolean(
    selectedConvId &&
      (isCompletedConversationId(selectedConvId) ||
        selectedClosedConversation ||
        hasApprovedApiMessage),
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

  // Track initial approval state so we only navigate when approval happens
  // DURING the session, not when the page loads with an already-approved conversation.
  useEffect(() => {
    if (!selectedConvId) return;
    const key = String(selectedConvId);

    // Wait for messages to finish loading before recording initial state
    if (!messagesQuery.isSuccess) return;

    // Record whether this conversation was already approved on first load
    if (approvedOnLoadRef.current[key] === undefined) {
      approvedOnLoadRef.current[key] = hasApprovedApiMessage;
    }

    if (!hasApprovedApiMessage) return;

    // If it was already approved when we first loaded it, don't navigate away
    if (approvedOnLoadRef.current[key] === true) return;

    const latestDelivery = [...apiMessages]
      .reverse()
      .find(
        (message) =>
          message.type === "content_delivery" ||
          message.type === "video_submission" ||
          String(message.message ?? "").startsWith(CONTENT_DELIVERY_PREFIX),
      );

    saveCompletedCampaignEntry({
      conversationId: selectedConvId,
      campaignId: stateLocation?.campaignId,
      applicationId: stateLocation?.applicationId,
      campaignName: stateLocation?.campaignName,
      amount: stateLocation?.campaignBudget,
      category: stateLocation?.category,
      mediaUrl: getContentMessageMediaUrl(latestDelivery),
      date: new Date().toISOString(),
    });

    queryClient.setQueryData(
      queryKeys.chat.conversations(),
      (oldData: unknown) => {
        const oldResponse = getObject(oldData);
        const oldConversations = Array.isArray(oldResponse?.data)
          ? (oldResponse.data as Conversation[])
          : [];

        return {
          ...(oldResponse ?? { success: true }),
          data: oldConversations.filter(
            (conversation) => String(conversation.id) !== String(selectedConvId),
          ),
        };
      },
    );

    navigate(
      role === "company"
        ? "/dashboard/company/campaigns"
        : "/dashboard/influencer/campaigns",
      { replace: true },
    );
  }, [
    hasApprovedApiMessage,
    messagesQuery.isSuccess,
    navigate,
    queryClient,
    role,
    apiMessages,
    selectedConvId,
    stateLocation?.applicationId,
    stateLocation?.campaignBudget,
    stateLocation?.campaignId,
    stateLocation?.campaignName,
    stateLocation?.category,
  ]);

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
        campaignId: getIdString(stateLocation?.campaignId),
        applicationId: getIdString(stateLocation?.applicationId),
        influencerId: getIdString(stateLocation?.influencerId),
        companyId: getIdString(stateLocation?.companyId),
        campaignName:
          stateLocation?.campaignName || statePeerName || "New Conversation",
        category: stateLocation?.category || "",
        status: selectedConvId ? "active" : "pending",
        lastMessage: "",
        lastActive: "",
        unreadCount: 0,
        name: statePeerName || "Company",
        avatar: "",
        roleLabel: "",
        campaignBudget:
          stateLocation?.campaignBudget !== undefined &&
          stateLocation?.campaignBudget !== null
            ? String(stateLocation.campaignBudget)
            : "",
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
    stateLocation?.campaignId,
    stateLocation?.applicationId,
    stateLocation?.influencerId,
    stateLocation?.companyId,
    stateLocation?.campaignBudget,
    stateLocation?.category,
    apiMessages,
    pendingMessages,
    currentUserId,
    t,
    isRTL,
    role,
  ]);

  const resolveApplicationForSelectedConversation = useCallback(async () => {
    const directApplicationId =
      selectedConversation?.applicationId ||
      getIdString(stateLocation?.applicationId);

    if (directApplicationId) {
      return {
        id: directApplicationId,
        campaignId:
          selectedConversation?.campaignId ?? getIdString(stateLocation?.campaignId),
        price: selectedConversation?.campaignBudget ?? stateLocation?.campaignBudget,
        status: selectedConversation?.status,
        influencerId:
          selectedConversation?.influencerId ??
          getIdString(stateLocation?.influencerId),
      };
    }

    const campaignId =
      selectedConversation?.campaignId ?? getIdString(stateLocation?.campaignId);

    if (campaignId) {
      const applications = await campaignService.getCampaignApplications(campaignId);
      const matchingApplication =
        applications.data.find((application) =>
          isApplicationVisibleInConversation(application, selectedConvId),
        ) ||
        applications.data.find((application) =>
          isWorkableApplicationStatus(application.status),
        ) ||
        applications.data[0];

      if (matchingApplication?.id) {
        return {
          id: String(matchingApplication.id),
          campaignId:
            matchingApplication.campaign_id ??
            matchingApplication.campaign?.id ??
            campaignId,
          price: matchingApplication.price,
          status: matchingApplication.status,
          influencerId:
            matchingApplication.influencer?.id ??
            matchingApplication.user?.id ??
            selectedConversation?.influencerId,
        };
      }
    }

    const allApplications = await campaignService.getAllCampaignApplications();
    const matchingApplication =
      allApplications.data.find((application) =>
        isApplicationVisibleInConversation(application, selectedConvId),
      ) ||
      allApplications.data.find((application) => {
        const appCampaignId = application.campaign_id ?? application.campaign?.id;
        return (
          campaignId &&
          appCampaignId &&
          String(appCampaignId) === String(campaignId) &&
          isWorkableApplicationStatus(application.status)
        );
      }) ||
      allApplications.data.find((application) =>
        isWorkableApplicationStatus(application.status),
      );

    if (!matchingApplication?.id) return null;

    return {
      id: String(matchingApplication.id),
      campaignId:
        matchingApplication.campaign_id ??
        matchingApplication.campaign?.id ??
        campaignId,
      price: matchingApplication.price,
      status: matchingApplication.status,
      influencerId:
        matchingApplication.influencer?.id ??
        matchingApplication.user?.id ??
        selectedConversation?.influencerId,
    };
  }, [
    selectedConversation?.applicationId,
    selectedConversation?.campaignBudget,
    selectedConversation?.campaignId,
    selectedConversation?.influencerId,
    selectedConversation?.status,
    selectedConvId,
    stateLocation?.applicationId,
    stateLocation?.campaignBudget,
    stateLocation?.campaignId,
    stateLocation?.influencerId,
  ]);

  // ─── Handle sending a message ───
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isSendingMessage) return false;
      if (isPendingConversation) return false;
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
      isPendingConversation,
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
  const handleAgreementSubmit = async (data: ConvertCampaignFormData) => {
    if (sendMutation.isPending) return false;

    const summaryText = [
      data.message,
      data.final_price ? `final_price: ${data.final_price}` : "",
      data.deliverables_count
        ? `deliverables_count: ${data.deliverables_count}`
        : "",
      data.delivery_date ? `delivery_date: ${data.delivery_date}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const lockKey = [
      selectedConvId ?? "",
      summaryText,
      data.delivery_date ?? "",
    ].join("::");

    if (
      !selectedConvId ||
      !summaryText ||
      agreementSubmitLockRef.current === lockKey
    ) {
      return false;
    }

    agreementSubmitLockRef.current = lockKey;

    try {
      await sendMutation.mutateAsync({
        message: summaryText,
        type: "agreement",
        delivery_date: data.delivery_date,
      });
      return true;
    } catch (error) {
      agreementSubmitLockRef.current = null;
      throw error;
    }
  };

  const handleAgreementAction = useCallback(
    async (
      agreementId: string,
      status: "accepted" | "rejected",
    ) => {
      if (!selectedConvId) return false;

      await sendMutation.mutateAsync({
        message: buildAgreementStatusMessage(agreementId, status),
        type: "text",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(selectedConvId),
      });

      // If rejected, close the chat and clean up the campaign from both sides
      if (status === "rejected") {
        const campaignId = selectedConversation?.campaignId ?? stateLocation?.campaignId;
        const applicationId = selectedConversation?.applicationId ?? stateLocation?.applicationId;
        
        // Track the rejection so UI hides it everywhere
        if (campaignId) {
          useCampaignStore.getState().addRejectedCampaignId(campaignId);
        }
        if (applicationId) {
          useCampaignStore.getState().addRejectedCampaignId(applicationId);
        }

        // Remove conversation from the local list
        queryClient.setQueryData(
          queryKeys.chat.conversations(),
          (oldData: unknown) => {
            const oldResponse = getObject(oldData);
            const oldConversations = Array.isArray(oldResponse?.data)
              ? (oldResponse.data as Conversation[])
              : [];

            return {
              ...(oldResponse ?? { success: true }),
              data: oldConversations.filter(
                (conversation) => String(conversation.id) !== String(selectedConvId),
              ),
            };
          },
        );

        // Invalidate all campaign-related queries on both influencer and company sides
        await queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
        await queryClient.invalidateQueries({ queryKey: ["campaigns", "collaboration-requests"] });
        await queryClient.invalidateQueries({ queryKey: ["campaigns", "company-collaboration-requests"] });
        await queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.myApplications() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.allApplications() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.list() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.influencer() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.company() });

        if (selectedConversation?.campaignId) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.campaigns.details(selectedConversation.campaignId),
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.campaigns.applications(selectedConversation.campaignId),
          });
        }

        // Navigate back to campaigns page
        navigate(
          role === "company"
            ? "/dashboard/company/campaigns"
            : "/dashboard/influencer",
          { replace: true },
        );
      }

      return true;
    },
    [queryClient, navigate, role, selectedConvId, selectedConversation?.applicationId, selectedConversation?.campaignId, sendMutation, stateLocation?.applicationId, stateLocation?.campaignId],
  );

  const handleContentDeliverySubmit = useCallback(
    async (data: { media_url: string; message: string; notes: string }) => {
      if (!selectedConvId) return false;

      if (isLocalDeliveryUrl(data.media_url)) {
        await sendMutation.mutateAsync({
          message: buildContentDeliveryMessage(data),
          type: "text",
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.chat.messages(selectedConvId),
        });
        return true;
      }

      try {
        await sendMutation.mutateAsync({
          message: data.message,
          type: "content_delivery",
          media_url: data.media_url,
          notes: data.notes,
        });
      } catch (error) {
        const isValidationError =
          axios.isAxiosError(error) && error.response?.status === 422;

        if (!isValidationError) {
          throw error;
        }

        try {
          await sendMutation.mutateAsync({
            message: data.notes || data.message,
            type: "content_delivery",
            media_url: data.media_url,
          });
        } catch (fallbackError) {
          const shouldTryVideoSubmission =
            axios.isAxiosError(fallbackError) &&
            fallbackError.response?.status === 422;

          if (!shouldTryVideoSubmission) {
            throw fallbackError;
          }

          await sendMutation.mutateAsync({
            message: data.notes || data.message,
            type: "video_submission",
            media_url: data.media_url,
          }).catch(async (videoError) => {
            const shouldFallbackToText =
              axios.isAxiosError(videoError) &&
              videoError.response?.status === 422;

            if (!shouldFallbackToText) {
              throw videoError;
            }

            await sendMutation.mutateAsync({
              message: buildContentDeliveryMessage(data),
              type: "text",
            });
          });
        }
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(selectedConvId),
      });

      return true;
    },
    [queryClient, selectedConvId, sendMutation],
  );

  const handleModificationRequestSubmit = useCallback(
    async (data: ModificationRequestPayload) => {
      if (!selectedConvId) return false;

      let applicationId = selectedConversation?.applicationId || "";

      if (!applicationId && selectedConversation?.campaignId) {
        const applications = await campaignService.getCampaignApplications(
          selectedConversation.campaignId,
        );
        const matchingApplication =
          applications.data.find(
            (application) =>
              application.conversation_id &&
              String(application.conversation_id) === String(selectedConvId),
          ) ||
          applications.data.find(
            (application) =>
              ["accepted", "modification_requested", "content_approved"].indexOf(
                getString(application.status).toLowerCase(),
              ) !== -1,
          ) ||
          applications.data[0];

        applicationId = matchingApplication?.id
          ? String(matchingApplication.id)
          : "";
      }

      let modificationId: string | number | null = null;

      if (applicationId) {
        const response = await campaignService.requestModification(
          applicationId,
          {
            modification_reason_id: data.modification_reason_id,
            new_delivery_date: data.new_delivery_date,
            description: data.description,
          },
        );
        const responseObject = getObject(response);
        const responseData = getObject(responseObject?.data);
        const modificationObject =
          getObject(responseObject?.modification) ??
          getObject(responseData?.modification) ??
          responseData ??
          responseObject;

        modificationId =
          getIdString(
            modificationObject?.id,
            modificationObject?.modification_id,
            responseObject?.modification_id,
            responseData?.modification_id,
          ) || null;
      }

      await sendMutation.mutateAsync({
        message: buildModificationRequestMessage({
          ...data,
          modification_id: modificationId,
          modification_status: "pending",
        }),
        type: "text",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(selectedConvId),
      });

      return true;
    },
    [
      queryClient,
      selectedConvId,
      selectedConversation?.applicationId,
      selectedConversation?.campaignId,
      sendMutation,
    ],
  );

  const handleModificationAction = useCallback(
    async (
      messageId: string,
      status: "accepted" | "rejected",
      reason?: string,
    ) => {
      if (!selectedConvId) return false;

      const modificationMessage = selectedConversation?.messages.find(
        (message) => message.id === messageId,
      );
      const modificationId = getIdString(
        modificationMessage?.modification_id,
        messageId,
      );

      if (modificationMessage?.modification_id) {
        await campaignService.respondToModification(modificationId, {
          status,
          rejection_reason:
            status === "rejected"
              ? reason ||
                t(
                  "chat.modificationRequest.rejectionReasonFallback",
                  "The influencer rejected the modification request.",
                )
              : null,
        });
      }

      await sendMutation.mutateAsync({
        message: buildModificationResponseMessage(modificationId, status),
        type: "text",
      });

      if (status === "rejected" && reason) {
        await sendMutation.mutateAsync({
          message: reason,
          type: "text",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(selectedConvId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });

      return true;
    },
    [
      queryClient,
      selectedConvId,
      selectedConversation?.messages,
      sendMutation,
      t,
    ],
  );

  const handleApproveContent = useCallback(async (review: InfluencerReviewInput) => {
    if (!selectedConvId) return false;

    const latestDelivery = [...(selectedConversation?.messages ?? [])]
      .reverse()
      .find(
        (message) =>
          message.type === "content_delivery" ||
          String(message.type ?? "") === "video_submission" ||
          String(message.text ?? "").startsWith(CONTENT_DELIVERY_PREFIX),
      );
    const mediaUrl =
      latestDelivery?.media_url ||
      getContentMessageMediaUrl({
        media_url: latestDelivery?.media_url,
        message: latestDelivery?.text,
        type: latestDelivery?.type,
      } as Message) ||
      "";
    const campaignTitle =
      selectedConversation?.campaignName ||
      stateLocation?.campaignName ||
      (isRTL ? "محتوى الحملة" : "Campaign content");

    const resolvedApplication = await resolveApplicationForSelectedConversation();
    const applicationId = resolvedApplication?.id ?? "";
    const influencerId =
      review.influencerId ??
      resolvedApplication?.influencerId ??
      selectedConversation?.influencerId ??
      getIdString(stateLocation?.influencerId);
    const reviewAverage = getReviewAverage(review);
    const savedReview = saveInfluencerReview({
      ...review,
      influencerId,
      influencerName:
        review.influencerName ??
        selectedConversation?.name ??
        stateLocation?.peerName,
      campaignId:
        review.campaignId ??
        resolvedApplication?.campaignId ??
        selectedConversation?.campaignId ??
        stateLocation?.campaignId,
      applicationId:
        review.applicationId ?? applicationId ?? selectedConversation?.applicationId,
      conversationId: review.conversationId ?? selectedConvId,
      campaignName: review.campaignName ?? campaignTitle,
    });

    if (applicationId) {
      try {
        await campaignService.approveContent(applicationId, {
          type: "video",
          media_url: mediaUrl || "https://example.com/approved-content",
          title: campaignTitle,
        });
      } catch (error) {
        console.warn("approve-content endpoint failed", error);
      }

      try {
        await campaignService.submitInfluencerReview(applicationId, {
          influencer_id: influencerId,
          campaign_id:
            resolvedApplication?.campaignId ??
            selectedConversation?.campaignId ??
            stateLocation?.campaignId,
          schedule_commitment: review.scheduleCommitment,
          content_quality: review.contentQuality,
          communication: review.communication,
          rating: reviewAverage,
          comment: review.comment,
        });
      } catch (error) {
        console.warn("influencer review endpoint failed", error);
      }
    }

    await sendMutation.mutateAsync({
      message: CONTENT_APPROVED_PREFIX,
      type: "text",
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.chat.messages(selectedConvId),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.chat.conversations(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.campaigns.myApplications(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.campaigns.allApplications(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.campaigns.list(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.influencer(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.influencerPosts(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.company(),
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.influencerEarnings(),
    });
    saveCompletedCampaignEntry({
      conversationId: selectedConvId,
      influencerId,
      applicationId: applicationId || selectedConversation?.applicationId,
      campaignId:
        resolvedApplication?.campaignId ??
        selectedConversation?.campaignId ??
        stateLocation?.campaignId,
      campaignName: campaignTitle,
      companyName:
        role === "company"
          ? undefined
          : selectedConversation?.name ?? stateLocation?.peerName,
      influencerName:
        role === "company"
          ? selectedConversation?.name ?? stateLocation?.peerName
          : undefined,
      amount:
        resolvedApplication?.price ??
        selectedConversation?.campaignBudget ??
        stateLocation?.campaignBudget ??
        null,
      category: selectedConversation?.category ?? stateLocation?.category ?? null,
      mediaUrl: mediaUrl || null,
      notes: latestDelivery?.notes ?? latestDelivery?.text ?? null,
      date: new Date().toISOString(),
      review: {
        scheduleCommitment: savedReview.scheduleCommitment,
        contentQuality: savedReview.contentQuality,
        communication: savedReview.communication,
        comment: savedReview.comment,
        average: reviewAverage,
      },
    });
    queryClient.setQueryData(
      queryKeys.chat.conversations(),
      (oldData: unknown) => {
        const oldResponse = getObject(oldData);
        const oldConversations = Array.isArray(oldResponse?.data)
          ? (oldResponse.data as Conversation[])
          : [];

        return {
          ...(oldResponse ?? { success: true }),
          data: oldConversations.filter(
            (conversation) => String(conversation.id) !== String(selectedConvId),
          ),
        };
      },
    );
    if (selectedConversation?.campaignId) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.details(selectedConversation.campaignId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.applications(selectedConversation.campaignId),
      });
    }

    navigate(
      role === "company"
        ? "/dashboard/company/campaigns"
        : "/dashboard/influencer/campaigns",
      { replace: true },
    );

    return true;
  }, [
    isRTL,
    navigate,
    queryClient,
    role,
    selectedConvId,
    selectedConversation?.applicationId,
    selectedConversation?.campaignId,
    selectedConversation?.campaignName,
    selectedConversation?.influencerId,
    selectedConversation?.messages,
    selectedConversation?.name,
    resolveApplicationForSelectedConversation,
    sendMutation,
    stateLocation?.applicationId,
    stateLocation?.campaignBudget,
    stateLocation?.campaignId,
    stateLocation?.campaignName,
    stateLocation?.category,
    stateLocation?.influencerId,
    stateLocation?.peerName,
  ]);

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
    const emptyTitle = isSelectedCompletedChat
      ? t("chat.completedTitle", "لا توجد محادثة لهذه الحملة")
      : t("chat.empty", "لا توجد محادثات حاليا");
    const emptyDescription = isSelectedCompletedChat
      ? t(
          "chat.completedDescription",
          "هذه الحملة اكتملت، لذلك تم إغلاق المحادثة ونقلها إلى الحملات المكتملة.",
        )
      : role === "company"
        ? t("chat.emptyCompany", "تواصل مع مؤثر أو أنشئ حملة لبدء محادثة")
        : t("chat.emptyInfluencer", "قم بالتقدم لحملة أو انتظر تواصل شركة معك");

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
            {isSelectedCompletedChat ? (
              <p className="mt-2 text-sm text-[#707068]">{emptyTitle}</p>
            ) : null}
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
            {isSelectedCompletedChat ? (
              <p className="max-w-xl text-sm leading-6 text-[#707068]">
                {emptyDescription}
              </p>
            ) : null}
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

          {isPendingConversation && (
            <div className="mx-4 mb-3 rounded-xl bg-[rgba(111,66,193,0.07)] px-4 py-3 text-center text-sm text-[#6f42c1]">
              {isRTL
                ? "تم الاتفاق — يتم إعداد الدردشة، يرجى الانتظار قليلاً"
                : "Agreement reached — Chat is being set up, please wait a moment"}
            </div>
          )}

          <MessageThread
            conversation={selectedConversation}
            role={role}
            isRTL={isRTL}
            onAgreementSubmit={handleAgreementSubmit}
            onAgreementAction={handleAgreementAction}
            onContentDeliverySubmit={handleContentDeliverySubmit}
            onApproveContent={handleApproveContent}
            onModificationRequestSubmit={handleModificationRequestSubmit}
            onModificationAction={handleModificationAction}
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
