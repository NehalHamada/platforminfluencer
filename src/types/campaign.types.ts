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
  is_ready: boolean | 0 | 1;
};

export type CampaignApplyResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  conversation_id?: string | number;
};

export type UpdateApplicationStatusPayload = {
  status: "accepted" | "rejected";
};

export type ApproveContentPayload = {
  type: string;
  media_url: string;
  title: string;
};

export type RequestModificationPayload = {
  modification_reason_id: string | number;
  new_delivery_date: string;
  description: string;
};

export type CollaborationRequest = {
  id: number;
  campaign_id?: number;
  influencer_id?: number;
  company_id?: number;
  status: string;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  company?: ApiUser;
  influencer?: ApiUser;
  user?: ApiUser;
  conversation_id?: string | number;
  price?: string | number;
};

export type CollaborationRequestResponse = {
  success: boolean;
  data: CollaborationRequest[];
};

export type RespondToCollabPayload = {
  status: "accepted" | "rejected";
};

export type SendCollaborationRequestPayload = {
  name: string;
  content_type_id: number;
  goal: string;
  budget_range_id: number;
  execution_time_id: number;
  message: string;
};

export type RespondToModificationPayload = {
  status: "accepted" | "rejected";
  rejection_reason?: string | null;
};

export type Campaign = {
  id: string | number;
  user_id?: string | number;
  name?: string;
  idea?: string;
  platform?: ApiNamedEntity & { icon?: string | null };
  target_audience?: ApiNamedEntity;
  target_location?: ApiNamedEntity;
  execution_time?: ApiNamedEntity;
  campaign_type?: ApiNamedEntity;
  budget_range?: ApiNamedEntity;
  influencer_count_range?: ApiNamedEntity;
  user?: ApiUser;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Aliases for different backend formats
  campaignType?: ApiNamedEntity;
  executionTime?: ApiNamedEntity;
  budgetRange?: ApiNamedEntity;
  company_name?: string;
  campaign_type_name?: string;
  budget_range_name?: string;
  conversation_id?: string | number;
};

export type CampaignListResponse = {
  success?: boolean;
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
  campaign_id?: number;
  user_id?: number;
  price: string | number;
  note: string;
  execution_date: string;
  is_ready: number;
  status: string;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  user?: ApiUser;
  conversation_id?: string | number;
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

export type ApiNamedEntity = {
  id: number;
  name: string;
};

export type ApiUser = {
  id: number | string;
  name?: string;
  email?: string;
  avatar?: string | null;
  image?: string | null;
  profile_image?: string | null;
  company_name?: string;
  type?: string;
};

export type ApiCampaign = {
  id: number;
  user_id?: number;
  name: string;
  idea?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  campaign_type?: ApiNamedEntity;
  budget_range?: ApiNamedEntity;
  execution_time?: ApiNamedEntity;
  platform?: ApiNamedEntity & { icon?: string | null };
  target_audience?: ApiNamedEntity;
  target_location?: ApiNamedEntity;
  influencer_count_range?: ApiNamedEntity;
  user?: ApiUser;
};

export type ApiCampaignListResponse = {
  success: boolean;
  data: ApiCampaign[];
};
