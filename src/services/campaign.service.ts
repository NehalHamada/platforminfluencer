import { api } from "@/lib/axios";
import { getConversationIdFromResponse } from "@/utils/apiResponse";
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
  ApproveContentPayload,
  RequestModificationPayload,
  CollaborationRequestResponse,
  RespondToModificationPayload,
  SendCollaborationRequestPayload,
  InfluencerReviewPayload,
} from "@/types/campaign.types";

type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const getListFromResponse = (responseData: unknown): unknown[] => {
  if (Array.isArray(responseData)) return responseData;
  if (!isObject(responseData)) return [];

  const data = responseData.data;

  if (Array.isArray(data)) return data;
  if (isObject(data) && Array.isArray(data.data)) return data.data;
  if (isObject(data) && Array.isArray(data.applications)) return data.applications;
  if (isObject(data) && Array.isArray(data.requests)) return data.requests;
  if (isObject(data) && Array.isArray(data.collaboration_requests)) {
    return data.collaboration_requests;
  }
  if (isObject(data) && Array.isArray(data.collaborationRequests)) {
    return data.collaborationRequests;
  }
  if (Array.isArray(responseData.applications)) return responseData.applications;
  if (Array.isArray(responseData.requests)) return responseData.requests;
  if (Array.isArray(responseData.collaboration_requests)) {
    return responseData.collaboration_requests;
  }
  if (Array.isArray(responseData.collaborationRequests)) {
    return responseData.collaborationRequests;
  }

  const listKeys = [
    "items",
    "results",
    "records",
    "campaigns",
    "collaborations",
    "collaboration_requests",
    "collaborationRequests",
    "requests",
    "applications",
  ];

  for (const key of listKeys) {
    const value = responseData[key];
    if (Array.isArray(value)) return value;
    if (isObject(value)) {
      const nestedList = getListFromResponse(value);
      if (nestedList.length > 0) return nestedList;
    }
  }

  if (isObject(data)) return getListFromResponse(data);

  return [];
};

const getObject = (value: unknown): ApiObject | undefined =>
  isObject(value) ? value : undefined;

const getCampaignFromDetailsResponse = (responseData: unknown) => {
  if (!isObject(responseData)) return responseData;

  const data = responseData.data;
  if (isObject(data) && isObject(data.campaign)) return data.campaign;
  if (isObject(data)) return data;
  if (isObject(responseData.campaign)) return responseData.campaign;

  return responseData;
};

const mapCampaignApplication = (
  item: unknown,
  fallbackCampaign?: CampaignRequest["campaign"],
): CampaignRequest | null => {
  if (!isObject(item)) return null;

  const campaign = getObject(item.campaign) ?? fallbackCampaign;
  const user =
    getObject(item.user) ??
    getObject(item.influencer) ??
    getObject(item.creator) ??
    getObject(item.profile);

  return {
    ...(item as CampaignRequest),
    id: Number(item.id),
    price: item.price as string | number,
    note: getString(item.note ?? item.message, ""),
    execution_date: getString(item.execution_date ?? item.delivery_date, ""),
    is_ready: Number(item.is_ready ?? 0),
    status: getString(item.status, "pending"),
    created_at: getString(item.created_at, ""),
    updated_at: getString(item.updated_at, ""),
    campaign: campaign as CampaignRequest["campaign"],
    user: user as CampaignRequest["user"],
    influencer: getObject(item.influencer) as CampaignRequest["influencer"],
    conversation_id: getConversationIdFromResponse(item),
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
    const raw = isObject(response.data) ? response.data : {};
    const data = getListFromResponse(response.data) as CampaignListResponse["data"];

    return {
      ...(raw as Omit<CampaignListResponse, "data">),
      data,
      total: Number(raw.total ?? data.length),
    };
  },

  async getCampaignById(campaignId: string): Promise<CampaignDetailsResponse> {
    try {
      const response = await api.get(`/api/campaigns/${campaignId}`);
      const raw = isObject(response.data) ? response.data : {};

      return {
        ...(raw as Omit<CampaignDetailsResponse, "data">),
        data: getCampaignFromDetailsResponse(response.data) as CampaignDetailsResponse["data"],
      };
    } catch (error) {
      const campaignsResponse = await this.getCampaigns();
      const campaign = campaignsResponse.data.find(
        (item) => String(item.id) === String(campaignId),
      );

      if (!campaign) throw error;

      return {
        data: campaign,
      };
    }
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
    const fallbackCampaign =
      isObject(response.data) && isObject(response.data.campaign)
        ? (response.data.campaign as CampaignRequest["campaign"])
        : undefined;
    const data = getListFromResponse(response.data)
      .map((item) => mapCampaignApplication(item, fallbackCampaign))
      .filter((item): item is CampaignRequest => Boolean(item));

    return {
      message: isObject(response.data)
        ? getString(response.data.message)
        : undefined,
      data,
      total: isObject(response.data) ? Number(response.data.total) : undefined,
    };
  },

  async getAllCampaignApplications(): Promise<CampaignApplicationsResponse> {
    const campaignsResponse = await this.getCampaigns();
    const campaigns = campaignsResponse.data ?? [];

    const applicationResponses = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const response = await this.getCampaignApplications(campaign.id);
          return {
            ...response,
            data: response.data.map((application) => ({
              ...application,
              campaign: application.campaign ?? campaign,
            })),
          };
        } catch {
          return {
            data: [],
            total: 0,
          };
        }
      }),
    );

    const data = applicationResponses.reduce<CampaignRequest[]>(
      (items, response) => items.concat(response.data ?? []),
      [],
    );

    return {
      data,
      total: data.length,
    };
  },

  async getMyApplications(
    params?: CampaignRequestsQueryParams,
  ): Promise<CampaignRequestsResponse> {
    const response = await api.get("/api/my-applications", { params });
    const data = getListFromResponse(response.data)
      .map((item) => mapCampaignApplication(item))
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

  async updateApplicationStatus(
    applicationId: string | number,
    status: "accepted" | "rejected",
  ): Promise<unknown> {
    const response = await api.patch(`/api/applications/${applicationId}/status`, {
      status,
    });
    return response.data;
  },

  async approveContent(
    applicationId: string | number,
    payload: ApproveContentPayload,
  ) {
    const response = await api.post(
      `/api/company/applications/${applicationId}/approve-content`,
      payload,
    );
    return response.data;
  },

  async requestModification(
    applicationId: string | number,
    payload: RequestModificationPayload,
  ) {
    const response = await api.post(
      `/api/company/applications/${applicationId}/request-modification`,
      payload,
    );
    return response.data;
  },

  async getCollaborationRequests(): Promise<CollaborationRequestResponse> {
    const response = await api.get("/api/influencer/collaboration-requests");
    return {
      ...(isObject(response.data) ? response.data : { success: true }),
      data: getListFromResponse(response.data),
    } as CollaborationRequestResponse;
  },

  async getCompanyCollaborationRequests(): Promise<CollaborationRequestResponse> {
    const response = await api.get("/api/company/collaboration-requests");
    return {
      ...(isObject(response.data) ? response.data : { success: true }),
      data: getListFromResponse(response.data),
    } as CollaborationRequestResponse;
  },

  async sendCollaborationRequest(
    influencerId: string | number,
    payload: SendCollaborationRequestPayload,
  ): Promise<unknown> {
    const response = await api.post(
      `/api/company/influencers/${influencerId}/collaboration-requests`,
      payload,
    );
    return response.data;
  },

  async respondToCollaborationRequest(
    requestId: string | number,
    status: "accepted" | "rejected",
  ): Promise<unknown> {
    const response = await api.patch(
      `/api/influencer/collaboration-requests/${requestId}/respond`,
      { status },
    );
    return response.data;
  },

  async respondToModification(
    modificationId: string | number,
    payload: RespondToModificationPayload,
  ) {
    const response = await api.post(
      `/api/influencer/modifications/${modificationId}/respond`,
      payload,
    );
    return response.data;
  },

  async submitInfluencerReview(
    applicationId: string | number,
    payload: InfluencerReviewPayload,
  ) {
    const endpoints = [
      `/api/company/applications/${applicationId}/review`,
      `/api/company/applications/${applicationId}/rate`,
      `/api/applications/${applicationId}/review`,
    ];
    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const response = await api.post(endpoint, payload);
        return response.data;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  },
};
