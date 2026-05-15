import type {
  Campaign,
  CampaignRequest,
  CollaborationRequest,
} from "@/types/campaign.types";
import type { Conversation } from "@/types/chat.types";
import type { CompletedCampaignEntry } from "@/utils/completedCampaigns";
import {
  isAgreementStatus,
  isContentApprovedStatus,
} from "@/utils/campaignProgress";
import {
  getConversationApplicationId,
  getConversationCampaignId,
  getContentMessageMediaUrl,
  getLatestContentMessage,
} from "@/utils/completedCampaignSource";
import {
  getCampaignPaymentSummary,
  getPaymentDataFromSources,
  hasCampaignPaymentData,
  sameCampaignText,
} from "@/utils/campaignPayment";

type BuildCompletedCampaignViewsOptions = {
  role: "company" | "influencer";
  applications?: CampaignRequest[];
  collaborationRequests?: CollaborationRequest[];
  campaigns?: Campaign[];
  entries?: CompletedCampaignEntry[];
  conversations?: Conversation[];
  campaignId?: string | number | null;
  completedText?: string;
};

export type CompletedCampaignView = {
  key: string;
  id: string;
  campaignId?: string | number | null;
  applicationId?: string | number | null;
  conversationId?: string | number | null;
  influencerId?: string | number | null;
  date: string;
  title: string;
  companyName: string;
  influencerName: string;
  status: string;
  completedSteps: number;
  paymentSummary: ReturnType<typeof getCampaignPaymentSummary>;
  contentUrl?: string | null;
  completedText: string;
  review?: CompletedCampaignEntry["review"];
};

type CompletedDraft = {
  key: string;
  application?: CampaignRequest;
  request?: CollaborationRequest;
  campaign?: Campaign;
  entry?: CompletedCampaignEntry;
  conversation?: Conversation;
};

const isPlaceholderText = (value: unknown) => {
  const normalized = String(value ?? "").trim().toLowerCase();

  return (
    !normalized ||
    normalized === "-" ||
    normalized === "—" ||
    normalized === "undefined" ||
    normalized === "null"
  );
};

const normalizeId = (value?: string | number | null) =>
  isPlaceholderText(value) ? "" : String(value).trim();

const sameId = (a?: string | number | null, b?: string | number | null) => {
  const left = normalizeId(a);
  const right = normalizeId(b);

  return Boolean(left && right && left === right);
};

const isCampaign = (value: Campaign | undefined): value is Campaign =>
  Boolean(value);

const text = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find((value) => !isPlaceholderText(value)) ?? "";

const record = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getNestedContentUrl = (value: unknown) => {
  const raw = record(value);
  const content = record(raw.content);
  const approvedContent = record(raw.approved_content ?? raw.approvedContent);
  const post = record(raw.post ?? raw.influencer_post ?? raw.influencerPost);

  return text(
    raw.media_url,
    raw.mediaUrl,
    raw.content_url,
    raw.contentUrl,
    raw.content_link,
    raw.contentLink,
    raw.approved_media_url,
    raw.approvedMediaUrl,
    content.media_url,
    content.mediaUrl,
    content.url,
    content.link,
    approvedContent.media_url,
    approvedContent.mediaUrl,
    approvedContent.url,
    approvedContent.link,
    post.media_url,
    post.mediaUrl,
    post.url,
    post.link,
  );
};

const getCampaignId = (draft: CompletedDraft) =>
  draft.campaign?.id ??
  draft.application?.campaign?.id ??
  draft.application?.campaign_id ??
  draft.request?.campaign?.id ??
  draft.request?.campaign_id ??
  draft.entry?.campaignId ??
  getConversationCampaignId(draft.conversation);

const getApplicationId = (draft: CompletedDraft) =>
  draft.application?.id ??
  draft.entry?.applicationId ??
  getConversationApplicationId(draft.conversation);

const getInfluencerId = (draft: CompletedDraft) =>
  text(
    draft.application?.influencer?.id,
    draft.application?.user?.id,
    draft.request?.influencer?.id,
    draft.request?.user?.id,
    draft.entry?.influencerId,
    draft.conversation?.influencer &&
      "id" in draft.conversation.influencer &&
      draft.conversation.influencer.id,
  );

const getConversationId = (draft: CompletedDraft) =>
  draft.conversation?.id ??
  draft.application?.conversation_id ??
  draft.request?.conversation_id ??
  draft.campaign?.conversation_id ??
  draft.entry?.conversationId;

const getTitle = (draft: CompletedDraft) =>
  text(
    draft.campaign?.name,
    draft.application?.campaign?.name,
    draft.request?.campaign?.name,
    draft.entry?.campaignName,
    draft.conversation?.campaign_name,
    draft.conversation?.campaignName,
    draft.conversation?.title,
    draft.conversation?.name,
    draft.campaign?.campaign_type?.name,
    draft.campaign?.campaignType?.name,
    draft.campaign?.campaign_type_name,
    draft.application?.campaign?.campaign_type?.name,
    draft.request?.campaign?.campaign_type?.name,
    "-",
  );

const getCompanyName = (draft: CompletedDraft) =>
  text(
    draft.campaign?.user?.company_name,
    draft.campaign?.company_name,
    draft.application?.campaign?.user?.company_name,
    draft.application?.campaign?.company_name,
    draft.request?.company?.company_name,
    draft.request?.company?.name,
    draft.request?.campaign?.user?.company_name,
    draft.request?.campaign?.company_name,
    draft.entry?.companyName,
    draft.conversation?.company &&
      "company_name" in draft.conversation.company &&
      draft.conversation.company.company_name,
    draft.conversation?.company &&
      "name" in draft.conversation.company &&
      draft.conversation.company.name,
    "-",
  );

const getInfluencerName = (draft: CompletedDraft) =>
  text(
    draft.application?.influencer?.name,
    draft.application?.user?.name,
    draft.request?.influencer?.name,
    draft.request?.user?.name,
    draft.entry?.influencerName,
    draft.conversation?.influencer &&
      "name" in draft.conversation.influencer &&
      draft.conversation.influencer.name,
    "-",
  );

const matchesDraft = (a: CompletedDraft, b: CompletedDraft) => {
  const aApplicationId = getApplicationId(a);
  const bApplicationId = getApplicationId(b);
  const aConversationId = getConversationId(a);
  const bConversationId = getConversationId(b);
  const aCampaignId = getCampaignId(a);
  const bCampaignId = getCampaignId(b);

  if (sameId(aApplicationId, bApplicationId)) return true;
  if (sameId(aConversationId, bConversationId)) return true;
  const sameTitle = sameCampaignText(getTitle(a), getTitle(b));
  const sameCompany = sameCampaignText(getCompanyName(a), getCompanyName(b));
  const sameInfluencer = sameCampaignText(
    getInfluencerName(a),
    getInfluencerName(b),
  );

  if (!sameId(aCampaignId, bCampaignId)) {
    return sameTitle && (sameCompany || sameInfluencer);
  }

  return sameTitle || sameCompany || sameInfluencer;
};

const mergeEntry = (
  current?: CompletedCampaignEntry,
  next?: CompletedCampaignEntry,
) => {
  if (!current) return next;
  if (!next) return current;

  return {
    ...current,
    ...next,
    campaignId: next.campaignId ?? current.campaignId,
    applicationId: next.applicationId ?? current.applicationId,
    conversationId: next.conversationId ?? current.conversationId,
    influencerId: next.influencerId ?? current.influencerId,
    campaignName: next.campaignName ?? current.campaignName,
    companyName: next.companyName ?? current.companyName,
    influencerName: next.influencerName ?? current.influencerName,
    amount: next.amount ?? current.amount,
    category: next.category ?? current.category,
    date: next.date ?? current.date,
    mediaUrl: next.mediaUrl ?? current.mediaUrl,
    notes: next.notes ?? current.notes,
    review: next.review ?? current.review,
  };
};

const mergeDraft = (current: CompletedDraft, next: CompletedDraft) => ({
  ...current,
  ...next,
  application: current.application ?? next.application,
  request: current.request ?? next.request,
  campaign:
    [
      current.campaign,
      next.campaign,
      current.application?.campaign,
      current.request?.campaign,
      next.application?.campaign,
      next.request?.campaign,
    ].find(hasCampaignPaymentData) ??
    current.campaign ??
    next.campaign ??
    current.application?.campaign ??
    current.request?.campaign ??
    next.application?.campaign ??
    next.request?.campaign,
  entry: mergeEntry(current.entry, next.entry),
  conversation: current.conversation ?? next.conversation,
});

const getDraftKey = (draft: CompletedDraft) => {
  const applicationId = getApplicationId(draft);
  const conversationId = getConversationId(draft);
  const campaignId = getCampaignId(draft);

  if (applicationId) return `application:${applicationId}`;
  if (conversationId) return `conversation:${conversationId}`;
  if (campaignId) return `campaign:${campaignId}:${getTitle(draft)}`;
  return draft.key;
};

const hasMeaningfulText = (...values: unknown[]) =>
  values.some((value) => !isPlaceholderText(value));

const hasMeaningfulIdentity = (draft: CompletedDraft) =>
  Boolean(
    normalizeId(getApplicationId(draft)) ||
      normalizeId(getConversationId(draft)) ||
      normalizeId(getCampaignId(draft)) ||
      hasMeaningfulText(
        getTitle(draft),
        getCompanyName(draft),
        getInfluencerName(draft),
        draft.entry?.mediaUrl,
      ),
  );

const isVisibleCompletedView = (
  view: CompletedCampaignView,
  role: BuildCompletedCampaignViewsOptions["role"],
) =>
  role === "company"
    ? hasMeaningfulText(view.title, view.influencerName)
    : hasMeaningfulText(view.title, view.companyName);

const isCampaignFilterMatch = (
  draft: CompletedDraft,
  campaignId?: string | number | null,
) =>
  !campaignId ||
  sameId(getCampaignId(draft), campaignId) ||
  sameCampaignText(getTitle(draft), campaignId);

export const buildCompletedCampaignViews = ({
  role,
  applications = [],
  collaborationRequests = [],
  campaigns = [],
  entries = [],
  conversations = [],
  campaignId,
  completedText = "Content approved and campaign completed",
}: BuildCompletedCampaignViewsOptions): CompletedCampaignView[] => {
  const drafts: CompletedDraft[] = [];

  const findCampaign = (draft: CompletedDraft) => {
    const matches = [
      draft.campaign,
      draft.application?.campaign,
      draft.request?.campaign,
      ...campaigns.filter(
        (campaign) =>
          sameId(campaign.id, getCampaignId(draft)) ||
          sameCampaignText(campaign.name, getTitle(draft)),
      ),
    ].filter(Boolean) as Campaign[];

    return (
      matches.find(hasCampaignPaymentData) ??
      matches[0] ??
      campaigns.find(
      (campaign) =>
        sameId(campaign.id, getCampaignId(draft)) ||
        sameCampaignText(campaign.name, getTitle(draft)),
      )
    );
  };

  const findEntry = (draft: CompletedDraft) =>
    draft.entry ??
    entries.find(
      (entry) =>
        sameId(entry.applicationId, getApplicationId(draft)) ||
        sameId(entry.conversationId, getConversationId(draft)) ||
        sameId(entry.campaignId, getCampaignId(draft)) ||
        sameCampaignText(entry.campaignName, getTitle(draft)),
    );

  const findConversation = (draft: CompletedDraft) =>
    draft.conversation ??
    conversations.find(
      (conversation) =>
        sameId(conversation.id, getConversationId(draft)) ||
        sameId(getConversationApplicationId(conversation), getApplicationId(draft)) ||
        sameId(getConversationCampaignId(conversation), getCampaignId(draft)) ||
        sameCampaignText(conversation.campaign_name, getTitle(draft)) ||
        sameCampaignText(conversation.campaignName, getTitle(draft)),
    );

  const addDraft = (draft: CompletedDraft) => {
    const enriched = {
      ...draft,
      entry: findEntry(draft),
      conversation: findConversation(draft),
      campaign: findCampaign(draft),
    };

    if (!isCampaignFilterMatch(enriched, campaignId)) return;

    const existingIndex = drafts.findIndex((item) => matchesDraft(item, enriched));
    if (existingIndex >= 0) {
      drafts[existingIndex] = mergeDraft(drafts[existingIndex], enriched);
      return;
    }

    drafts.push({ ...enriched, key: getDraftKey(enriched) });
  };

  applications
    .filter(
      (application) =>
        isContentApprovedStatus(application.status) ||
        isAgreementStatus(application.status),
    )
    .forEach((application) =>
      addDraft({
        key: `application:${application.id}`,
        application,
        campaign: application.campaign,
      }),
    );

  collaborationRequests
    .filter(
      (request) =>
        isContentApprovedStatus(request.status) ||
        isAgreementStatus(request.status),
    )
    .forEach((request) =>
      addDraft({
        key: `request:${request.id}`,
        request,
        campaign: request.campaign,
      }),
    );

  campaigns
    .filter(
      (campaign) =>
        isContentApprovedStatus(campaign.status) ||
        isAgreementStatus(campaign.status),
    )
    .forEach((campaign) =>
      addDraft({
        key: `campaign:${campaign.id}`,
        campaign,
      }),
    );

  entries.forEach((entry, index) => {
    const entryDraft = {
      key: `entry:${entry.applicationId ?? entry.conversationId ?? entry.campaignId ?? index}`,
      entry,
    };

    if (hasMeaningfulIdentity(entryDraft)) {
      addDraft(entryDraft);
    }
  });

  const paymentCampaigns = [
    ...campaigns,
    ...applications.map((application) => application.campaign),
    ...collaborationRequests.map((request) => request.campaign),
    ...drafts.map((draft) => draft.campaign),
  ]
    .filter(isCampaign)
    .filter(hasCampaignPaymentData)
    .reduce<Campaign[]>((items, campaign) => {
      const campaignId = String(campaign.id ?? "");
      const exists = items.some(
        (item) =>
          (campaignId && String(item.id ?? "") === campaignId) ||
          sameCampaignText(item.name, campaign.name),
      );

      if (!exists) items.push(campaign);

      return items;
    }, []);
  const usedPaymentCampaignIds = new Set<string>();
  const reservePaymentCampaign = (draft: CompletedDraft, fallbackIndex: number) => {
    const directCampaign = findCampaign(draft);
    const directPaymentCampaign =
      directCampaign && hasCampaignPaymentData(directCampaign)
        ? directCampaign
        : undefined;
    const matchedPaymentCampaign =
      directPaymentCampaign ??
      paymentCampaigns.find(
        (campaign) =>
          !usedPaymentCampaignIds.has(String(campaign.id)) &&
          (sameId(campaign.id, getCampaignId(draft)) ||
            sameCampaignText(campaign.name, getTitle(draft))),
      ) ??
      paymentCampaigns.find(
        (campaign) => !usedPaymentCampaignIds.has(String(campaign.id)),
      ) ??
      paymentCampaigns[fallbackIndex] ??
      paymentCampaigns[0];

    if (matchedPaymentCampaign?.id) {
      usedPaymentCampaignIds.add(String(matchedPaymentCampaign.id));
    }

    return {
      displayCampaign: directCampaign ?? matchedPaymentCampaign,
      paymentCampaign: matchedPaymentCampaign ?? directCampaign,
    };
  };

  return drafts
    .map((draft, index) => {
      const { displayCampaign, paymentCampaign } = reservePaymentCampaign(
        draft,
        index,
      );
      const campaign = displayCampaign;
      const entry = findEntry(draft);
      const conversation = findConversation(draft);
      const status =
        entry?.status ??
        draft.application?.status ??
        draft.request?.status ??
        campaign?.status ??
        "content_approved";
      const paymentData = getPaymentDataFromSources(
        paymentCampaign,
        campaign,
        draft.application?.campaign,
        draft.request?.campaign,
        draft.application,
        draft.request,
        conversation,
        entry,
      );
      const paymentSummary = getCampaignPaymentSummary({
        campaign: paymentCampaign ?? campaign,
        paymentData,
        fallbackAmount:
          draft.application?.price ??
          draft.request?.price ??
          entry?.amount ??
          conversation?.campaign_budget ??
          conversation?.campaignBudget ??
          campaign?.budget_range?.name ??
          campaign?.budgetRange?.name ??
          campaign?.budget_range_name ??
          null,
      });
      const latestContentMessage = getLatestContentMessage(
        conversation?.messages,
      );

      return {
        key: draft.key,
        id: String(getCampaignId({ ...draft, campaign }) ?? draft.key),
        campaignId: getCampaignId({ ...draft, campaign }) ?? null,
        applicationId: getApplicationId(draft) ?? null,
        conversationId: getConversationId(draft) ?? null,
        influencerId: getInfluencerId(draft) ?? null,
        date: text(
          draft.application?.execution_date,
          entry?.date,
          conversation?.last_active,
          conversation?.lastActive,
          campaign?.created_at,
          draft.request?.created_at,
          entry?.completedAt,
          "-",
        ),
        title: getTitle({ ...draft, campaign }),
        companyName: role === "company" ? getCompanyName({ ...draft, campaign }) : getCompanyName({ ...draft, campaign }),
        influencerName: getInfluencerName(draft),
        status,
        completedSteps: isContentApprovedStatus(status) ? 3 : 1,
        paymentSummary,
        contentUrl:
          entry?.mediaUrl ||
          getContentMessageMediaUrl(latestContentMessage) ||
          getNestedContentUrl(draft.application) ||
          getNestedContentUrl(draft.request) ||
          getNestedContentUrl(campaign) ||
          paymentSummary.contentLink ||
          null,
        completedText,
        review: entry?.review,
      };
    })
    .filter((view) => isVisibleCompletedView(view, role))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
};
