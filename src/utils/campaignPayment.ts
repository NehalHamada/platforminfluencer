type PaymentRecord = Record<string, unknown>;

export type CampaignPaymentData = {
  totalPrice?: string;
  postsCount?: string;
  adPlan?: string;
  executionDate?: string;
  campaignName?: string;
  contentLink?: string;
  paymentMethod?: string;
  influencerAmount?: string;
  commissionAmount?: string;
};

export type CampaignPaymentSummary = {
  totalAmount: string;
  commission: string;
  influencerNet: string;
  postsCount?: string;
  executionDate?: string;
  adPlan?: string;
  contentLink?: string;
  paymentMethod?: string;
};

const getText = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find(Boolean) ?? "";

export const normalizeCampaignText = (value?: string | number | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const sameCampaignText = (
  a?: string | number | null,
  b?: string | number | null,
) => {
  const first = normalizeCampaignText(a);
  const second = normalizeCampaignText(b);

  return Boolean(
    first &&
      second &&
      (first === second || first.includes(second) || second.includes(first)),
  );
};

const getRecord = (value: unknown): PaymentRecord =>
  value && typeof value === "object" ? (value as PaymentRecord) : {};

const parseIdea = (idea: unknown): PaymentRecord => {
  if (!idea) return {};
  if (typeof idea === "object") return getRecord(idea);
  if (typeof idea !== "string") return {};

  try {
    return getRecord(JSON.parse(idea));
  } catch {
    return {};
  }
};

const getNestedPaymentRecord = (campaign: PaymentRecord) => {
  const candidates = [
    campaign.campaign,
    campaign.payment,
    campaign.payment_data,
    campaign.paymentData,
    campaign.campaign_payment,
    campaign.campaignPayment,
    campaign.details,
    campaign.meta,
  ];

  return candidates.reduce<PaymentRecord>(
    (acc, value) => ({ ...acc, ...getRecord(value) }),
    {},
  );
};

export const parseCampaignPaymentData = (
  campaign?: unknown,
): CampaignPaymentData => {
  if (!campaign) return {};

  const rawCampaign = getRecord(campaign);
  const nestedCampaign = getRecord(rawCampaign.campaign);
  const ideaRecord = parseIdea(rawCampaign.idea);
  const nestedIdeaRecord = parseIdea(nestedCampaign.idea);
  const nestedPayment = getNestedPaymentRecord(rawCampaign);
  const parsed =
    ideaRecord.source === "campaign_payment"
      ? ideaRecord
      : nestedIdeaRecord.source === "campaign_payment"
        ? nestedIdeaRecord
        : {};

  return {
    totalPrice: getText(
      parsed.total_price,
      parsed.totalPrice,
      parsed.total,
      parsed.reserved_amount,
      parsed.reservedAmount,
      nestedPayment.total_price,
      nestedPayment.totalPrice,
      nestedPayment.total_amount,
      nestedPayment.totalAmount,
      nestedPayment.reserved_amount,
      nestedPayment.reservedAmount,
      nestedPayment.amount,
      nestedPayment.price,
      rawCampaign.total_price,
      rawCampaign.totalPrice,
      rawCampaign.payment_total,
      rawCampaign.paymentTotal,
      rawCampaign.total_amount,
      rawCampaign.totalAmount,
      rawCampaign.reserved_amount,
      rawCampaign.reservedAmount,
    ),
    postsCount: getText(
      parsed.posts_count,
      parsed.postsCount,
      nestedPayment.posts_count,
      nestedPayment.postsCount,
      rawCampaign.posts_count,
      rawCampaign.postsCount,
    ),
    adPlan: getText(
      parsed.ad_plan,
      parsed.adPlan,
      nestedPayment.ad_plan,
      nestedPayment.adPlan,
      rawCampaign.ad_plan,
      rawCampaign.adPlan,
    ),
    executionDate: getText(
      parsed.execution_date,
      parsed.executionDate,
      nestedPayment.execution_date,
      nestedPayment.executionDate,
      rawCampaign.execution_date,
      rawCampaign.executionDate,
    ),
    campaignName: getText(
      rawCampaign.name,
      rawCampaign.campaign_name,
      nestedCampaign.name,
      nestedCampaign.campaign_name,
    ),
    contentLink: getText(
      parsed.content_link,
      parsed.contentLink,
      nestedPayment.content_link,
      nestedPayment.contentLink,
      rawCampaign.content_link,
      rawCampaign.contentLink,
    ),
    paymentMethod: getText(
      parsed.payment_method,
      parsed.paymentMethod,
      nestedPayment.payment_method,
      nestedPayment.paymentMethod,
      rawCampaign.payment_method,
      rawCampaign.paymentMethod,
    ),
    influencerAmount: getText(
      parsed.influencer_amount,
      parsed.influencerAmount,
      parsed.settlement_amount,
      parsed.final_amount,
      nestedPayment.influencer_amount,
      nestedPayment.influencerAmount,
      nestedPayment.settlement_amount,
      nestedPayment.final_amount,
      rawCampaign.influencer_amount,
      rawCampaign.influencerAmount,
      rawCampaign.settlement_amount,
      rawCampaign.final_amount,
    ),
    commissionAmount: getText(
      parsed.commission_amount,
      parsed.commissionAmount,
      parsed.commission,
      nestedPayment.commission_amount,
      nestedPayment.commissionAmount,
      nestedPayment.commission,
      rawCampaign.commission_amount,
      rawCampaign.commissionAmount,
      rawCampaign.commission,
    ),
  };
};

export const hasCampaignPaymentData = (campaign?: unknown) => {
  const paymentData = parseCampaignPaymentData(campaign);
  return Boolean(
    paymentData.totalPrice ||
      paymentData.paymentMethod ||
      paymentData.postsCount ||
      paymentData.executionDate,
  );
};

export const getPaymentDataFromSources = (...sources: unknown[]) => {
  const parsedSources = sources.map(parseCampaignPaymentData);

  return (
    parsedSources.find((paymentData) => paymentData.totalPrice) ??
    parsedSources.find(
      (paymentData) =>
        paymentData.paymentMethod ||
        paymentData.postsCount ||
        paymentData.executionDate,
    ) ??
    {}
  );
};

export const getNumericAmount = (value?: string | number | null) => {
  const normalized = String(value ?? "")
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String("\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669".indexOf(digit)),
    )
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String("\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9".indexOf(digit)),
    )
    .replace(/[^\d.]/g, "");
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : 0;
};

const formatAmount = (value: number, fallback = "-") =>
  value > 0
    ? new Intl.NumberFormat("ar-EG", {
        maximumFractionDigits: 0,
      }).format(value)
    : fallback;

export const getCampaignPaymentSummary = ({
  campaign,
  fallbackAmount,
  paymentData: explicitPaymentData,
}: {
  campaign?: unknown;
  fallbackAmount?: string | number | null;
  paymentData?: CampaignPaymentData;
}): CampaignPaymentSummary => {
  const paymentData = explicitPaymentData ?? parseCampaignPaymentData(campaign);
  const totalAmountText = getText(paymentData.totalPrice, fallbackAmount);
  const totalAmount = getNumericAmount(totalAmountText);
  const explicitCommission = getNumericAmount(paymentData.commissionAmount);
  const explicitInfluencerNet = getNumericAmount(paymentData.influencerAmount);
  const commissionAmount = explicitCommission || totalAmount * 0.1;
  const influencerNet = explicitInfluencerNet || totalAmount - commissionAmount;

  return {
    totalAmount: totalAmount > 0 ? totalAmountText : "-",
    commission:
      explicitCommission > 0
        ? paymentData.commissionAmount ?? formatAmount(explicitCommission)
        : formatAmount(commissionAmount),
    influencerNet:
      explicitInfluencerNet > 0
        ? paymentData.influencerAmount ?? formatAmount(explicitInfluencerNet)
        : formatAmount(influencerNet),
    postsCount: paymentData.postsCount,
    executionDate: paymentData.executionDate,
    adPlan: paymentData.adPlan,
    contentLink: paymentData.contentLink,
    paymentMethod: paymentData.paymentMethod,
  };
};
