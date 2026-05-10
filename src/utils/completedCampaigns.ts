export type CompletedCampaignEntry = {
  campaignId?: string | number | null;
  applicationId?: string | number | null;
  conversationId?: string | number | null;
  influencerId?: string | number | null;
  campaignName?: string | null;
  companyName?: string | null;
  influencerName?: string | null;
  amount?: string | number | null;
  category?: string | null;
  date?: string | null;
  mediaUrl?: string | null;
  notes?: string | null;
  status?: string | null;
  completedAt?: string;
  review?: {
    scheduleCommitment: number;
    contentQuality: number;
    communication: number;
    comment: string;
    average: number;
  };
};

const COMPLETED_CAMPAIGNS_KEY = "completed-campaigns";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const isPlaceholderValue = (value?: string | number | null) => {
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
  isPlaceholderValue(value) ? "" : String(value).trim();

const preferValue = <T>(next: T | undefined, current: T | undefined) =>
  isPlaceholderValue(next as string | number | null) ? current : next ?? current;

const getStorageKey = () => {
  if (!canUseStorage()) return COMPLETED_CAMPAIGNS_KEY;

  try {
    const rawAuth =
      window.sessionStorage.getItem("auth-storage") ??
      window.sessionStorage.getItem("auth") ??
      window.sessionStorage.getItem("user") ??
      window.localStorage.getItem("auth-storage") ??
      window.localStorage.getItem("auth") ??
      window.localStorage.getItem("user");
    if (!rawAuth) return COMPLETED_CAMPAIGNS_KEY;

    const parsed = JSON.parse(rawAuth);
    const user =
      parsed?.state?.user ??
      parsed?.user ??
      parsed?.state?.auth?.user ??
      parsed?.auth?.user;
    const id = normalizeId(user?.id);

    return id ? `${COMPLETED_CAMPAIGNS_KEY}:${id}` : COMPLETED_CAMPAIGNS_KEY;
  } catch {
    return COMPLETED_CAMPAIGNS_KEY;
  }
};

const parseEntries = (raw: string | null): CompletedCampaignEntry[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const isSameEntry = (
  a: CompletedCampaignEntry,
  b: CompletedCampaignEntry,
) => {
  const sameApplication =
    normalizeId(a.applicationId) &&
    normalizeId(a.applicationId) === normalizeId(b.applicationId);
  const sameConversation =
    normalizeId(a.conversationId) &&
    normalizeId(a.conversationId) === normalizeId(b.conversationId);
  const sameCampaign =
    normalizeId(a.campaignId) &&
    normalizeId(a.campaignId) === normalizeId(b.campaignId);

  return Boolean(sameApplication || sameConversation || sameCampaign);
};

const mergeEntryData = (
  current: CompletedCampaignEntry,
  next: CompletedCampaignEntry,
): CompletedCampaignEntry => ({
  ...current,
  ...next,
  campaignId: preferValue(next.campaignId, current.campaignId),
  applicationId: preferValue(next.applicationId, current.applicationId),
  conversationId: preferValue(next.conversationId, current.conversationId),
  influencerId: preferValue(next.influencerId, current.influencerId),
  campaignName: preferValue(next.campaignName, current.campaignName),
  companyName: preferValue(next.companyName, current.companyName),
  influencerName: preferValue(next.influencerName, current.influencerName),
  amount: preferValue(next.amount, current.amount),
  category: preferValue(next.category, current.category),
  date: preferValue(next.date, current.date),
  mediaUrl: preferValue(next.mediaUrl, current.mediaUrl),
  notes: preferValue(next.notes, current.notes),
  review: next.review ?? current.review,
  status: "content_approved",
  completedAt: next.completedAt ?? current.completedAt,
});

const mergeEntries = (entries: CompletedCampaignEntry[]) =>
  entries.reduce<CompletedCampaignEntry[]>((acc, entry) => {
    const existingIndex = acc.findIndex((item) => isSameEntry(item, entry));

    if (existingIndex >= 0) {
      acc[existingIndex] = mergeEntryData(acc[existingIndex], entry);
    } else {
      acc.push(entry);
    }

    return acc;
  }, []);

export const getCompletedCampaignEntries = (): CompletedCampaignEntry[] => {
  if (!canUseStorage()) return [];

  const userEntries = parseEntries(window.localStorage.getItem(getStorageKey()));
  const sharedEntries = parseEntries(
    window.localStorage.getItem(COMPLETED_CAMPAIGNS_KEY),
  );

  return mergeEntries([...userEntries, ...sharedEntries]);
};

export const saveCompletedCampaignEntry = (
  entry: CompletedCampaignEntry,
) => {
  if (!canUseStorage()) return;

  const current = getCompletedCampaignEntries();
  const existingEntry = current.find((item) => isSameEntry(item, entry));
  const nextEntry = mergeEntryData(existingEntry ?? {}, entry);
  const completedEntry = {
    ...nextEntry,
    status: "content_approved",
    completedAt:
      entry.completedAt ?? existingEntry?.completedAt ?? new Date().toISOString(),
  };

  const next = current.filter((item) => !isSameEntry(item, completedEntry));

  const serialized = JSON.stringify([completedEntry, ...next]);
  window.localStorage.setItem(getStorageKey(), serialized);
  window.localStorage.setItem(COMPLETED_CAMPAIGNS_KEY, serialized);
};

export const isCompletedConversationId = (conversationId?: string | number | null) =>
  Boolean(
    normalizeId(conversationId) &&
      getCompletedCampaignEntries().some(
        (entry) =>
          normalizeId(entry.conversationId) === normalizeId(conversationId),
      ),
  );

export const isCompletedCampaignId = (campaignId?: string | number | null) =>
  Boolean(
    normalizeId(campaignId) &&
      getCompletedCampaignEntries().some(
        (entry) => normalizeId(entry.campaignId) === normalizeId(campaignId),
      ),
  );

export const isCompletedApplicationId = (
  applicationId?: string | number | null,
) =>
  Boolean(
    normalizeId(applicationId) &&
      getCompletedCampaignEntries().some(
        (entry) =>
          normalizeId(entry.applicationId) === normalizeId(applicationId),
      ),
  );
