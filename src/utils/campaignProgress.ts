export const normalizeCampaignStatus = (status?: string | null) =>
  String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

export const isAgreementStatus = (status?: string | null) =>
  ["accepted", "accept", "approved"].indexOf(normalizeCampaignStatus(status)) !==
  -1;

export const isContentApprovedStatus = (status?: string | null) =>
  [
    "content_approved",
    "approved_content",
    "contentapproved",
    "published",
    "posted",
    "completed",
    "complete",
    "settled",
    "paid",
  ].indexOf(normalizeCampaignStatus(status)) !== -1;

export const isRejectedStatus = (status?: string | null) =>
  ["rejected", "reject"].indexOf(normalizeCampaignStatus(status)) !== -1;

export const isClosedCampaignStatus = (status?: string | null) =>
  isContentApprovedStatus(status) || isRejectedStatus(status);

export const getCampaignProgressStepCount = (status?: string | null) => {
  if (isContentApprovedStatus(status)) return 3;
  if (isAgreementStatus(status)) return 1;
  if (normalizeCampaignStatus(status) === "modification_requested") return 1;
  return 0;
};
