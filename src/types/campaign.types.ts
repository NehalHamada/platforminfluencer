import type { CampaignSchema } from "@/schema/campaign.schema";
import type { FieldError, UseFormRegister } from "react-hook-form";

export type CampaignPayload = {
  campaignName: string;
  campaignIdea: string;
  platform: string;
  targetAge: string;
  targetCountry: string;
  campaignDuration: string;
  campaignType: string;
  estimatedBudget: string;
  influencersCount: string;
};

export type CampaignResponse = {
  message: string;
  data?: {
    id: string;
    campaignName: string;
  };
};

export type Campaign = {
  id: string;
  campaignName: string;
  campaignIdea: string;
  platform: string;
  targetAge: string;
  targetCountry: string;
  campaignDuration: string;
  campaignType: string;
  estimatedBudget: string;
  influencersCount: string;
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
  followers: string;
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
