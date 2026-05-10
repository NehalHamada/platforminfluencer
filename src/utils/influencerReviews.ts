export type InfluencerReview = {
  id: string;
  influencerId?: string | number | null;
  influencerName?: string | null;
  campaignId?: string | number | null;
  applicationId?: string | number | null;
  conversationId?: string | number | null;
  campaignName?: string | null;
  scheduleCommitment: number;
  contentQuality: number;
  communication: number;
  comment: string;
  createdAt: string;
};

export type InfluencerReviewInput = Omit<InfluencerReview, "id" | "createdAt">;

const REVIEWS_KEY = "influencer-reviews";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeText = (value?: string | number | null) =>
  String(value ?? "").trim().toLowerCase();

const clampRating = (value: unknown) => {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 0;
  return Math.min(5, Math.max(0, Math.round(rating)));
};

const parseReviews = (raw: string | null): InfluencerReview[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const isSameReview = (a: InfluencerReview, b: InfluencerReview) => {
  const applicationId = normalizeText(a.applicationId);
  const conversationId = normalizeText(a.conversationId);
  const campaignId = normalizeText(a.campaignId);

  return Boolean(
    (applicationId && applicationId === normalizeText(b.applicationId)) ||
      (conversationId && conversationId === normalizeText(b.conversationId)) ||
      (campaignId &&
        campaignId === normalizeText(b.campaignId) &&
        normalizeText(a.influencerId || a.influencerName) ===
          normalizeText(b.influencerId || b.influencerName)),
  );
};

export const getInfluencerReviews = () => {
  if (!canUseStorage()) return [];
  return parseReviews(window.localStorage.getItem(REVIEWS_KEY));
};

export const getReviewAverage = (review: Pick<
  InfluencerReview,
  "scheduleCommitment" | "contentQuality" | "communication"
>) => {
  const values = [
    clampRating(review.scheduleCommitment),
    clampRating(review.contentQuality),
    clampRating(review.communication),
  ].filter((value) => value > 0);

  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
};

export const saveInfluencerReview = (input: InfluencerReviewInput) => {
  const review: InfluencerReview = {
    ...input,
    scheduleCommitment: clampRating(input.scheduleCommitment),
    contentQuality: clampRating(input.contentQuality),
    communication: clampRating(input.communication),
    id:
      normalizeText(input.applicationId) ||
      normalizeText(input.conversationId) ||
      `${normalizeText(input.influencerId || input.influencerName)}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (!canUseStorage()) return review;

  const current = getInfluencerReviews();
  const next = current.filter((item) => !isSameReview(item, review));
  window.localStorage.setItem(REVIEWS_KEY, JSON.stringify([review, ...next]));

  return review;
};

export const getInfluencerReviewSummary = ({
  influencerId,
  influencerName,
}: {
  influencerId?: string | number | null;
  influencerName?: string | null;
}) => {
  const id = normalizeText(influencerId);
  const name = normalizeText(influencerName);
  const reviews = getInfluencerReviews().filter((review) => {
    const reviewId = normalizeText(review.influencerId);
    const reviewName = normalizeText(review.influencerName);

    return Boolean((id && reviewId === id) || (name && reviewName === name));
  });

  if (!reviews.length) return null;

  const average =
    reviews.reduce((total, review) => total + getReviewAverage(review), 0) /
    reviews.length;

  return {
    average,
    count: reviews.length,
    latest: reviews[0],
  };
};
