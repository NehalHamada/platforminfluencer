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
  date: string;
  budget: string;
  status: "pending" | "rejected" | "accepted";
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
    avatar: string;
  };
  currentInfo: CurrentInfoItem[];
  upcomingCampaigns: UpcomingCampaignItem[];
  activities: ActivityItem[];
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
  id: number;
  campaignName: string;
  companyName: string;
  date: string;
  amount: string;
  status: "completed" | "pending";
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
  contentNotes: string;
  finalPrice: string;
  deliverablesCount: string;
  deliveryDate: string;
  agreementTerms: boolean;
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
