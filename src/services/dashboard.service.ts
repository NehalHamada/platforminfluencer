import { api } from "@/lib/axios";
import type {
  CompanyDashboardResponse,
  ConvertCampaignPayload,
  ConvertCampaignResponse,
  InfluencerDiscoveryItem,
  InfluencerDiscoveryQueryParams,
  InfluencerDiscoveryResponse,
  InfluencerChatPayload,
  InfluencerChatResponse,
  InfluencerDashboardResponse,
} from "@/types/dashboard.types";

type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const getNestedString = (value: unknown, keys: string[], fallback = "") => {
  if (!isObject(value)) return fallback;

  for (const key of keys) {
    const directValue = value[key];

    if (typeof directValue === "string" || typeof directValue === "number") {
      return String(directValue);
    }

    if (isObject(directValue)) {
      const nestedValue =
        directValue.name ??
        directValue.name_en ??
        directValue.name_ar ??
        directValue.title ??
        directValue.label;

      if (typeof nestedValue === "string" || typeof nestedValue === "number") {
        return String(nestedValue);
      }
    }
  }

  return fallback;
};

const getInfluencerDiscoveryList = (responseData: unknown): unknown[] => {
  if (Array.isArray(responseData)) return responseData;
  if (!isObject(responseData)) return [];

  const data = responseData.data;

  if (Array.isArray(data)) return data;
  if (isObject(data) && Array.isArray(data.data)) return data.data;

  return [];
};

const mapInfluencerDiscoveryItem = (
  item: unknown,
): InfluencerDiscoveryItem | null => {
  if (!isObject(item)) return null;

  const user = isObject(item.user) ? item.user : undefined;
  const profile = isObject(item.profile) ? item.profile : undefined;
  const id = Number(item.id ?? user?.id ?? profile?.id);

  if (!Number.isFinite(id)) return null;

  return {
    id,
    name: getString(
      item.name ?? item.full_name ?? item.influencer_name ?? user?.name,
      "Influencer",
    ),
    category: getNestedString(
      item,
      ["category", "content_type", "contentType", "field"],
      getString(item.category_name ?? item.content_type_name, ""),
    ),
    followers: getNestedString(
      item,
      ["followers", "follower_range", "followerRange"],
      getString(item.followers_count ?? item.followers_count_label, ""),
    ),
    engagement: getNestedString(
      item,
      ["engagement", "engagement_rate", "engagementRate"],
      getString(item.engagement_rate_value ?? item.engagement_rate, ""),
    ),
    image: getString(
      item.image ??
        item.avatar ??
        item.profile_image ??
        item.photo ??
        user?.avatar ??
        profile?.image,
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    ),
    platform: getNestedString(
      item,
      ["platform", "primary_platform", "primaryPlatform"],
      getString(item.platform_name, ""),
    ),
    audience: getNestedString(
      item,
      ["country", "audience", "target_location", "targetLocation"],
      getString(item.country_name ?? item.audience_name, ""),
    ),
  };
};

export const dashboardService = {
  async getInfluencerDashboard(): Promise<InfluencerDashboardResponse> {
    const response = await api.get("/dashboard/influencer");
    return response.data.data;
  },

  async createInfluencerChat(
    data: InfluencerChatPayload,
  ): Promise<InfluencerChatResponse> {
    const response = await api.post("/dashboard/company/influencer-chat", data);
    return response.data;
  },

  async convertDealToCampaign(
    data: ConvertCampaignPayload,
  ): Promise<ConvertCampaignResponse> {
    await Promise.resolve(data);

    return {
      message: "Campaign conversion submitted successfully",
      data: {
        id: `campaign-${Date.now()}`,
        status: "sent",
      },
    };
  },
  async getCompanyDashboard(): Promise<CompanyDashboardResponse> {
    const response = await api.get("/dashboard/company");
    return response.data.data;
  },

  async getInfluencerDiscovery(
    params: InfluencerDiscoveryQueryParams,
  ): Promise<InfluencerDiscoveryResponse> {
    const response = await api.get("/api/influencer-discovery", { params });
    const data = getInfluencerDiscoveryList(response.data)
      .map(mapInfluencerDiscoveryItem)
      .filter((item): item is InfluencerDiscoveryItem => Boolean(item));

    return {
      data,
      total: isObject(response.data) ? Number(response.data.total) : undefined,
    };
  },
};
