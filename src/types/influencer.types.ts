export type Influencer = {
  id: string;
  name: string;
  username?: string;
  image: string;
  category: string;
  followers: string;
  engagement: string;
  platform: string;
  country?: string;
};

export type InfluencerProfile = {
  id: string;
  name: string;
  username?: string;
  image: string;
  coverImage?: string;
  bio?: string;
  category: string;
  followers: string;
  engagement: string;
  platform: string;
  country?: string;
  accountLink?: string;
  contentType?: string;
  averageViews?: string;
  collaborationPrice?: string;
};

export type InfluencerListResponse = {
  message?: string;
  data: Influencer[];
  total?: number;
  page?: number;
  limit?: number;
};

export type InfluencerProfileResponse = {
  message?: string;
  data: InfluencerProfile;
};

export type InfluencersQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  platform?: string;
  country?: string;
};
