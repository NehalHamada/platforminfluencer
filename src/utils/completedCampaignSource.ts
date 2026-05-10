import type { Conversation, Message } from "@/types/chat.types";
import type { CompletedCampaignEntry } from "@/utils/completedCampaigns";

export const CONTENT_APPROVED_PREFIX = "__content_approved__";
const CONTENT_DELIVERY_PREFIX = "__content_delivery__:";

const getRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getNestedRecord = (value: unknown, key: string) =>
  getRecord(getRecord(value)[key]);

const getAnyText = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

const getAnyId = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

export const isContentApprovedMessage = (message: unknown) => {
  const raw = getRecord(message);

  return (
    String(raw.type ?? "") === "content_approved" ||
    String(raw.message ?? "").indexOf(CONTENT_APPROVED_PREFIX) === 0
  );
};

export const hasContentApprovalMessage = (messages?: Message[]) =>
  Boolean(messages?.some(isContentApprovedMessage));

export const getLatestContentMessage = (messages?: Message[]) =>
  [...(messages ?? [])]
    .reverse()
    .find(
      (message) =>
        message.type === "content_delivery" ||
        message.type === "video_submission" ||
        String(message.message ?? "").startsWith(CONTENT_DELIVERY_PREFIX),
    );

const parseContentDeliveryMessage = (message?: string | null) => {
  if (!message?.startsWith(CONTENT_DELIVERY_PREFIX)) return null;

  try {
    const parsed = JSON.parse(
      message.slice(CONTENT_DELIVERY_PREFIX.length),
    ) as Partial<{ media_url: string; message: string; notes: string }>;

    return parsed.media_url ? parsed : null;
  } catch {
    return null;
  }
};

export const getContentMessageMediaUrl = (message?: Message) =>
  getAnyText(
    message?.media_url,
    parseContentDeliveryMessage(message?.message)?.media_url,
  );

export const getContentMessageNotes = (message?: Message) =>
  getAnyText(
    message?.notes,
    parseContentDeliveryMessage(message?.message)?.notes,
    parseContentDeliveryMessage(message?.message)?.message,
    message?.message,
  );

export const getConversationApplicationId = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const application = getNestedRecord(conversation, "application");

  return getAnyId(
    raw.application_id,
    raw.applicationId,
    raw.campaign_application_id,
    raw.campaignApplicationId,
    application.id,
  );
};

export const getConversationCampaignId = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");

  return getAnyId(raw.campaign_id, raw.campaignId, campaign.id);
};

export const getConversationCampaignName = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");

  return getAnyText(
    raw.campaign_name,
    raw.campaignName,
    raw.name,
    raw.title,
    campaign.name,
    campaign.title,
    campaign.idea,
  );
};

export const getConversationCompanyName = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const company = getNestedRecord(conversation, "company");
  const campaign = getNestedRecord(conversation, "campaign");
  const campaignUser = getNestedRecord(campaign, "user");
  const participant = getNestedRecord(conversation, "participant");
  const otherUser = getNestedRecord(conversation, "other_user");

  return getAnyText(
    raw.company_name,
    raw.companyName,
    company.company_name,
    company.name,
    campaign.company_name,
    campaignUser.company_name,
    campaignUser.name,
    participant.company_name,
    otherUser.company_name,
  );
};

export const getConversationInfluencerName = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const influencer = getNestedRecord(conversation, "influencer");
  const user = getNestedRecord(conversation, "user");
  const participant = getNestedRecord(conversation, "participant");
  const otherUser = getNestedRecord(conversation, "other_user");

  return getAnyText(
    raw.influencer_name,
    raw.influencerName,
    influencer.name,
    user.name,
    participant.name,
    otherUser.name,
  );
};

export const getConversationAmount = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");
  const budgetRange = getNestedRecord(campaign, "budget_range");

  return getAnyText(
    raw.price,
    raw.amount,
    raw.campaign_budget,
    raw.campaignBudget,
    campaign.price,
    campaign.budget,
    budgetRange.name,
  );
};

export const getConversationCategory = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");
  const campaignType = getNestedRecord(campaign, "campaign_type");

  return getAnyText(
    raw.category,
    campaign.campaign_type_name,
    campaignType.name,
  );
};

export const getConversationDate = (conversation: Conversation) =>
  getAnyText(conversation.last_active, conversation.lastActive);

export const buildCompletedEntryFromConversation = (
  conversation: Conversation,
  messages?: Message[],
): CompletedCampaignEntry => {
  const latestContentMessage = getLatestContentMessage(messages);

  return {
    conversationId: conversation.id,
    applicationId: getConversationApplicationId(conversation),
    campaignId: getConversationCampaignId(conversation),
    campaignName: getConversationCampaignName(conversation),
    companyName: getConversationCompanyName(conversation),
    influencerName: getConversationInfluencerName(conversation),
    amount: getConversationAmount(conversation),
    category: getConversationCategory(conversation),
    date: latestContentMessage?.created_at ?? getConversationDate(conversation),
    mediaUrl: getContentMessageMediaUrl(latestContentMessage),
    notes: getContentMessageNotes(latestContentMessage),
    status: "content_approved",
  };
};
