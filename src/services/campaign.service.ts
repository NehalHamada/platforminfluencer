import { api } from "@/lib/axios";
import type {
  CampaignApplyPayload,
  CampaignApplyResponse,
  CampaignApplicationsResponse,
  CampaignRequest,
  CampaignPayload,
  CampaignResponse,
  CampaignListResponse,
  CampaignDetailsResponse,
  CampaignQueryParams,
  CampaignRequestsResponse,
  CampaignRequestsQueryParams,
} from "@/types/campaign.types";

type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const getNumber = (value: unknown) => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const getNestedString = (value: unknown, keys: string[], fallback = "") => {
  if (!isObject(value)) return fallback;

  for (const key of keys) {
    const fieldValue = value[key];

    if (typeof fieldValue === "string" || typeof fieldValue === "number") {
      return String(fieldValue);
    }

    if (isObject(fieldValue)) {
      const nestedValue =
        fieldValue.name ??
        fieldValue.name_en ??
        fieldValue.name_ar ??
        fieldValue.title ??
        fieldValue.label;

      if (typeof nestedValue === "string" || typeof nestedValue === "number") {
        return String(nestedValue);
      }
    }
  }

  return fallback;
};

const getListFromResponse = (responseData: unknown): unknown[] => {
  if (Array.isArray(responseData)) return responseData;
  if (!isObject(responseData)) return [];

  const data = responseData.data;

  if (Array.isArray(data)) return data;
  if (isObject(data) && Array.isArray(data.data)) return data.data;

  return [];
};

const mapCampaignApplication = (item: unknown): CampaignRequest | null => {
  if (!isObject(item)) return null;

  const application = isObject(item.application) ? item.application : undefined;
  const influencer = isObject(item.influencer)
    ? item.influencer
    : isObject(application?.influencer)
      ? application.influencer
      : undefined;
  const campaign = isObject(item.campaign)
    ? item.campaign
    : isObject(application?.campaign)
      ? application.campaign
      : undefined;
  const user = isObject(influencer?.user)
    ? influencer.user
    : isObject(item.user)
      ? item.user
      : isObject(application?.user)
        ? application.user
      : undefined;
  const id = Number(item.id ?? application?.id ?? influencer?.id ?? user?.id);

  if (!Number.isFinite(id)) return null;

  const rawPlatforms =
    item.platforms ?? influencer?.platforms ?? campaign?.platforms;
  const platformId = getNumber(item.platform_id ?? campaign?.platform_id);
  const platforms = Array.isArray(rawPlatforms)
    ? rawPlatforms
        .map((platform) =>
          getNestedString({ platform }, ["platform"], getString(platform, "")),
        )
        .filter(Boolean)
    : [
        getNestedString(
          item,
          ["platform"],
          getNestedString(campaign, ["platform"], ""),
        ),
      ].filter(Boolean);
  const userId = getString(item.user_id ?? application?.user_id, "");

  return {
    id,
    name: getString(
      item.name ??
        item.influencer_name ??
        application?.name ??
        influencer?.name ??
        user?.name,
      userId ? `Influencer #${userId}` : "Influencer",
    ),
    title: getNestedString(
      item,
      ["title", "content_type", "category", "campaign"],
      getString(campaign?.name ?? campaign?.idea, "Creator"),
    ),
    image: getString(
      item.image ??
        item.avatar ??
        item.profile_image ??
        influencer?.image ??
        influencer?.avatar ??
        user?.avatar,
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    ),
    platforms,
    platformIds: platformId ? [platformId] : [],
    followers: getNestedString(
      item,
      ["followers", "follower_range", "followerRange"],
      getString(item.followers_count ?? influencer?.followers_count, "-"),
    ),
    note: getString(item.note ?? application?.note, ""),
    executionDate: getString(
      item.execution_date ?? application?.execution_date,
      "",
    ),
    status: getString(item.status ?? application?.status, ""),
    requestedPrice: getString(
      item.requested_price ??
        item.price ??
        application?.price ??
        item.offered_price ??
        item.amount ??
        item.budget,
      "-",
    ),
  };
};

export const campaignService = {
  async createCampaign(data: CampaignPayload): Promise<CampaignResponse> {
    const response = await api.post("/api/campaigns", data);
    return response.data;
  },

  async getCampaigns(
    params?: CampaignQueryParams,
  ): Promise<CampaignListResponse> {
    const response = await api.get("/api/campaigns", { params });
    return response.data;
  },

  async getCampaignById(campaignId: string): Promise<CampaignDetailsResponse> {
    const response = await api.get(`/api/campaigns/${campaignId}`);
    return response.data;
  },

  async getCampaignRequests(
    campaignId: string,
    params?: CampaignRequestsQueryParams,
  ): Promise<CampaignRequestsResponse> {
    const response = await api.get(
      `/api/campaigns/${campaignId}/applications`,
      {
        params,
      },
    );
    return response.data;
  },

  async getCampaignApplications(
    campaignId: string | number,
  ): Promise<CampaignApplicationsResponse> {
    const response = await api.get(`/api/campaigns/${campaignId}/applications`);
    const data = getListFromResponse(response.data)
      .map(mapCampaignApplication)
      .filter((item): item is CampaignRequest => Boolean(item));

    return {
      message: isObject(response.data)
        ? getString(response.data.message)
        : undefined,
      data,
      total: isObject(response.data) ? Number(response.data.total) : undefined,
    };
  },

  async getMyApplications(
    params?: CampaignRequestsQueryParams,
  ): Promise<CampaignRequestsResponse> {
    const response = await api.get("/api/my-applications", { params });
    const data = getListFromResponse(response.data)
      .map(mapCampaignApplication)
      .filter((item): item is CampaignRequest => Boolean(item));

    return {
      message: isObject(response.data)
        ? getString(response.data.message)
        : undefined,
      data,
      total: isObject(response.data) ? Number(response.data.total) : undefined,
    };
  },

  async applyToCampaign(
    campaignId: string | number,
    payload: CampaignApplyPayload,
  ): Promise<CampaignApplyResponse> {
    const response = await api.post(
      `/api/campaigns/${campaignId}/apply`,
      payload,
    );
    return response.data;
  },
};
