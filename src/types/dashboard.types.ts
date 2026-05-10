export type SuggestedInfluencer = {
  id: number;
  name: string;
  profile_image: string | null;
  category: string | null;
  followers_count: number | null;
  engagement_rate: number | null;
};

export type LatestCampaignPost = {
  id: number;
  image: string | null;
  title: string | null;
};

export type CompanyHomeData = {
  suggested_influencers: SuggestedInfluencer[];
  latest_campaign_posts: LatestCampaignPost[];
  company_intro: Record<string, unknown> | null;
  campaign_matching: Record<string, unknown> | null;
  why_platform: Record<string, unknown> | null;
};

export type CompanyHomeResponse = {
  success: boolean;
  data: CompanyHomeData;
};

export type CurrentInfoItem = {
  id: number;
  date: string;
  title: string;
  company: string;
};

export type UpcomingCampaignItem = {
  id: number;
  brand: string;
  type: string;
  typeId?: number;
  date: string;
  dateId?: number;
  budget: string;
  budgetId?: number;
  platformId?: number;
  targetAudienceId?: number;
  targetLocationId?: number;
  influencerCountRangeId?: number;
  status: "pending" | "rejected" | "accepted";
  raw?: Record<string, unknown>;
};

export type CompanyDashboardResponse = {
  profile: {
    companyName: string;
    logo: string;
  };
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    pendingRequests: number;
  };
  recentCampaigns: {
    id: number;
    campaignName: string;
    status: string;
    budget: string;
  }[];
};

export type ActivityItem = {
  id: number;
  image: string;
  title: string;
  platform: string;
  followers: string;
  budget: string;
};

export type InfluencerDashboardResponse = {
  profile: {
    name: string;
    avatar?: string | null;
  };
  currentInfo: CurrentInfoItem[];
  upcomingCampaigns: UpcomingCampaignItem[];
  activities: ActivityItem[];
};

export type InfluencerPostsResponse = {
  data: ActivityItem[];
};

export type FeaturedInfluencer = {
  id: number;
  image: string;
  name: string;
  category: string;
  followers: string;
  engagement: string;
};

export type WhyPlatformItem = {
  id: number;
  text: string;
};

export type Influencer = {
  id: number;
  name: string;
  category: string;
  followers: string;
  engagement: string;
  image: string;
};

export type InfluencerDiscoveryItem = Influencer & {
  platform: string;
  audience: string;
  rating?: number | null;
  reviewsCount?: number | null;
};

export type InfluencerDiscoveryQueryParams = {
  platform_id?: string;
  follower_range_id?: string;
  engagement_rate_id?: string;
  fame_level_id?: string;
  content_type_id?: string;
  search?: string;
};

export type InfluencerDiscoveryResponse = {
  data: InfluencerDiscoveryItem[];
  total?: number;
};

export type SelectFieldProps = {
  label: string;
  value: string;
  isRTL: boolean;
};

export type InputFieldProps = {
  label: string;
  placeholder: string;
  isRTL: boolean;
};

export type EarningRow = {
  id: number | string;
  campaignName: string;
  companyName: string;
  date: string;
  amount: string;
  status: "completed" | "pending";
};

export type EarningsResponse = {
  total_earnings: number;
  pending_earnings: number;
  transactions: EarningRow[];
  currency: string;
};

export type InfluencerChatPayload = {
  campaignName: string;
  contentType: string;
  goal: string;
  budget: string;
  executionDate: string;
  message: string;
};

export type InfluencerChatResponse = {
  message: string;
  data?: {
    id: string;
    campaignName: string;
  };
};

export type ConvertCampaignPayload = {
  message: string;
  final_price: string;
  deliverables_count: string;
  delivery_date: string;
  agreement_terms: boolean;
};

export type ConvertCampaignFormData = ConvertCampaignPayload;

export type ConvertCampaignResponse = {
  message: string;
  data: {
    id: string;
    campaignName?: string;
    status: "draft" | "sent";
  };
};
