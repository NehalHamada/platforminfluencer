import type { FieldError, UseFormRegister } from "react-hook-form";

export type CampaignPayload = {
  name: string;
  idea: string;
  platform_id: number;
  target_audience_id: number;
  target_location_id: number;
  execution_time_id: number;
  campaign_type_id: number;
  budget_range_id: number;
  influencer_count_range_id: number;
};

export type CampaignResponse = {
  message: string;
  data?: {
    id: string;
    campaignName: string;
  };
};

export type CampaignApplyPayload = {
  price: number;
  note: string;
  execution_date: string;
  is_ready: 0 | 1;
};

export type CampaignApplyResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export type Campaign = {
  id: string;
  name?: string;
  idea?: string;
  campaignName?: string;
  campaignIdea?: string;
  platform?: string;
  targetAge?: string;
  targetCountry?: string;
  campaignDuration?: string;
  campaignType?: string;
  estimatedBudget?: string;
  influencersCount?: string;
  influencerName?: string;
  totalAmount?: string;
  commission?: string;
  netAmount?: string;
  status?: "draft" | "active" | "completed" | "cancelled";
  createdAt?: string;
};

export type CampaignListResponse = {
  message?: string;
  data: Campaign[];
  total?: number;
  page?: number;
  limit?: number;
};

export type CampaignQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  platform?: string;
};

export type CampaignDetailsResponse = {
  message?: string;
  data: Campaign;
};

export type CampaignInputFieldProps = {
  name: keyof CampaignSchema;
  label: string;
  placeholder: string;
  register: UseFormRegister<CampaignSchema>;
  error?: FieldError;
  isRTL: boolean;
};

export type CampaignRequest = {
  id: number;
  name: string;
  title: string;
  image: string;
  platforms: string[];
  platformIds?: number[];
  followers: string;
  note?: string;
  executionDate?: string;
  status?: string;
  requestedPrice: string;
};

export type CampaignRequestsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type CampaignRequestsResponse = {
  message?: string;
  data: CampaignRequest[];
  total?: number;
  page?: number;
  limit?: number;
};

export type CampaignApplicationsResponse = CampaignRequestsResponse;

export type CampaignsCopy = {
  heroAlt: string;
  badge: string;
  title: string;
  description: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  totalRequests: (count: number) => string;
  reviewAll: string;
  creatorLabel: string;
  followers: string;
  requestedPrice: string;
  accept: string;
  reject: string;
  ctaBadge: string;
  ctaTitle: string;
  ctaDescription: string;
  emailPlaceholder: string;
  subscribe: string;
  ctaNote: string;
};

export type CampaignStep = {
  id: number;
  label: string;
  completed: boolean;
};

export type CampaignSchema = {
  name: string;
  idea: string;
  platform_id: string;
  target_audience_id: string;
  target_location_id: string;
  execution_time_id: string;
  campaign_type_id: string;
  budget_range_id: string;
  influencer_count_range_id: string;
};
