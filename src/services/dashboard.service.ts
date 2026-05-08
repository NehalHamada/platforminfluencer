import { api } from "@/lib/axios";
import type {
  CompanyDashboardResponse,
  CompanyHomeResponse,
  CurrentInfoItem,
  ActivityItem,
  EarningRow,
  EarningsResponse,
  InfluencerDiscoveryItem,
  InfluencerDiscoveryQueryParams,
  InfluencerDiscoveryResponse,
  InfluencerDashboardResponse,
  InfluencerPostsResponse,
  UpcomingCampaignItem,
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

const getArray = (value: unknown, keys: string[]) => {
  if (Array.isArray(value)) return value;
  if (!isObject(value)) return [];

  for (const key of keys) {
    const item = value[key];
    if (Array.isArray(item)) return item;
    if (isObject(item) && Array.isArray(item.data)) return item.data;
  }

  if (isObject(value.data)) return getArray(value.data, keys);

  return [];
};

const getArraysByKeysDeep = (
  value: unknown,
  keys: string[],
  seen = new WeakSet<object>(),
): unknown[] => {
  if (Array.isArray(value)) return [];
  if (!isObject(value)) return [];
  if (seen.has(value)) return [];
  seen.add(value);

  const arrays: unknown[] = [];

  for (const key of keys) {
    const item = value[key];

    if (Array.isArray(item)) {
      arrays.push(...item);
    } else if (isObject(item) && Array.isArray(item.data)) {
      arrays.push(...item.data);
    }
  }

  for (const key in value) {
    const item = value[key];
    if (isObject(item)) {
      arrays.push(...getArraysByKeysDeep(item, keys, seen));
    }
  }

  return arrays;
};

const unwrapData = (value: unknown) => {
  if (isObject(value) && "data" in value) return value.data;
  return value;
};

const formatDate = (value: unknown) => {
  const date = getString(value, "");
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-GB");
};

const getNumber = (value: unknown) => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const normalizeStatus = (
  value: unknown,
): "pending" | "rejected" | "accepted" => {
  const status = getString(value, "pending").toLowerCase();
  if (status === "accepted" || status === "approved" || status === "active") {
    return "accepted";
  }
  if (status === "rejected" || status === "declined") return "rejected";
  return "pending";
};

const getUserProfile = (
  data: unknown,
): InfluencerDashboardResponse["profile"] => {
  const value = isObject(data) ? data : {};
  const profile = isObject(value.profile) ? value.profile : undefined;
  const user = isObject(value.user) ? value.user : undefined;
  const influencer = isObject(value.influencer) ? value.influencer : undefined;

  return {
    name: getString(
      profile?.name ??
        profile?.full_name ??
        user?.name ??
        user?.full_name ??
        influencer?.name ??
        influencer?.full_name,
      "Influencer",
    ),
    avatar: getString(
      profile?.avatar ??
        profile?.image ??
        profile?.photo ??
        profile?.profile_image ??
        user?.avatar ??
        user?.image ??
        influencer?.avatar ??
        influencer?.image,
      "",
    ),
  };
};

const mapCurrentInfo = (
  item: unknown,
  index: number,
): CurrentInfoItem | null => {
  if (!isObject(item)) return null;

  return {
    id: Number(item.id ?? index + 1),
    date:
      getNestedString(item, ["execution_time", "executionTime"]) ||
      formatDate(
        item.date ?? item.execution_date ?? item.deadline ?? item.due_date,
      ),
    title: getNestedString(
      item,
      ["campaign", "campaign_name", "title"],
      getString(item.title ?? item.name ?? item.campaignName, ""),
    ),
    company: getNestedString(
      item,
      ["company", "task", "current_task"],
      getString(
        item.company ?? item.company_name ?? item.task ?? item.status_text,
        "",
      ),
    ),
  };
};

const mapUpcomingCampaign = (
  item: unknown,
  index: number,
): UpcomingCampaignItem | null => {
  if (!isObject(item)) return null;

  return {
    id: getNumber(item.id) ?? index + 1,
    brand: getNestedString(
      item,
      ["brand", "company", "user", "campaign"],
      getString(item.brand ?? item.company_name ?? item.companyName, ""),
    ),
    type: getNestedString(
      item,
      [
        "type",
        "campaign",
        "campaign_type",
        "campaignType",
        "content_type",
        "contentType",
      ],
      getString(
        item.type ??
          item.campaign_type_name ??
          item.content_type_name ??
          item.content_type ??
          item.idea,
        "",
      ),
    ),
    typeId: getNumber(item.campaign_type_id),
    date:
      getNestedString(item, ["execution_time", "executionTime", "campaign"]) ||
      formatDate(
        item.date ?? item.execution_date ?? item.deadline ?? item.created_at,
      ),
    dateId: getNumber(item.execution_time_id),
    budget: getNestedString(
      item,
      ["budget_range", "budgetRange", "campaign"],
      getString(
        item.budget ?? item.price ?? item.amount ?? item.suggested_budget,
        "",
      ),
    ),
    budgetId: getNumber(item.budget_range_id),
    platformId: getNumber(item.platform_id),
    targetAudienceId: getNumber(item.target_audience_id),
    targetLocationId: getNumber(item.target_location_id),
    influencerCountRangeId: getNumber(item.influencer_count_range_id),
    status: normalizeStatus(item.status),
    raw: item,
  };
};

const mapActivity = (item: unknown, index: number): ActivityItem | null => {
  if (!isObject(item)) return null;

  return {
    id: Number(item.id ?? index + 1),
    image: getString(
      item.image ?? item.photo ?? item.thumbnail,
      "/assets/platImg.png",
    ),
    title: getString(item.title ?? item.name ?? item.campaign_name, ""),
    platform: getNestedString(
      item,
      ["platform"],
      getString(item.platform ?? item.platform_name, ""),
    ),
    followers: getString(
      item.followers ?? item.followers_count ?? item.audience,
      "",
    ),
    budget: getString(item.budget ?? item.price ?? item.amount, ""),
  };
};

const mapInfluencerPosts = (responseData: unknown): InfluencerPostsResponse => {
  const data = getArray(unwrapData(responseData), [
    "posts",
    "recent_posts",
    "data",
  ]).map(mapActivity);

  return {
    data: data.filter((item): item is ActivityItem => Boolean(item)),
  };
};

const mapInfluencerDashboard = (
  responseData: unknown,
): InfluencerDashboardResponse => {
  const data = unwrapData(responseData);
  const value = isObject(data) ? data : {};
  const upcomingKeys = [
    "upcomingCampaigns",
    "upcoming_campaigns",
    "availableCampaigns",
    "available_campaigns",
    "collaborationRequests",
    "collaboration_requests",
    "cooperationRequests",
    "cooperation_requests",
    "requests",
    "campaigns",
    "upcoming",
  ];

  return {
    profile: getUserProfile(value),
    currentInfo: getArray(value, [
      "currentInfo",
      "current_info",
      "current_tasks",
      "active_tasks",
      "tasks",
    ])
      .map(mapCurrentInfo)
      .filter((item): item is CurrentInfoItem => Boolean(item)),
    upcomingCampaigns: getArraysByKeysDeep(value, upcomingKeys)
      .map(mapUpcomingCampaign)
      .filter((item): item is UpcomingCampaignItem => Boolean(item)),
    activities: getArray(value, [
      "activities",
      "latest_activities",
      "latestActivities",
      "recent_posts",
    ])
      .map(mapActivity)
      .filter((item): item is ActivityItem => Boolean(item)),
  };
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

const normalizeEarningStatus = (value: unknown): "completed" | "pending" => {
  const status = getString(value, "pending").toLowerCase();
  if (status === "completed" || status === "done" || status === "paid") {
    return "completed";
  }
  return "pending";
};

const mapEarningRow = (item: unknown, index: number): EarningRow | null => {
  if (!isObject(item)) return null;

  return {
    id: Number(item.id ?? index + 1),
    campaignName: getString(item.campaign_name, ""),
    companyName: getString(item.company_name, ""),
    date: formatDate(item.date ?? item.created_at),
    amount: getString(item.amount, ""),
    status: normalizeEarningStatus(item.status),
  };
};

const mapEarningsResponse = (responseData: unknown): EarningsResponse => {
  const raw = unwrapData(responseData);
  const value = isObject(raw) ? raw : {};

  return {
    total_earnings: Number(value.total_earnings ?? 0),
    pending_earnings: Number(value.pending_earnings ?? 0),
    currency: getString(value.currency, "SAR"),
    transactions: getArray(value, ["transactions"])
      .map(mapEarningRow)
      .filter((item): item is EarningRow => Boolean(item)),
  };
};

export const dashboardService = {
  async getInfluencerDashboard(): Promise<InfluencerDashboardResponse> {
    const response = await api.get("/api/influencer/home");
    return mapInfluencerDashboard(response.data);
  },

  async getContentTypes() {
    const response = await api.get("/api/master-data/content-types");
    return response.data;
  },

  async getCampaignTypes() {
    const response = await api.get("/api/master-data/campaign-types");
    return response.data;
  },

  async getExecutionTimes() {
    const response = await api.get("/api/master-data/execution-times");
    return response.data;
  },

  async getInfluencerPosts(): Promise<InfluencerPostsResponse> {
    const response = await api.get("/api/influencer/posts");
    return mapInfluencerPosts(response.data);
  },

  async getInfluencerEarnings(): Promise<EarningsResponse> {
    const response = await api.get("/api/influencer/earnings");
    return mapEarningsResponse(response.data);
  },

  async getCompanyHome(): Promise<CompanyHomeResponse> {
    const response = await api.get("/api/company/home");
    return response.data;
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
