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
  ApproveContentPayload,
  RequestModificationPayload,
  CollaborationRequestResponse,
  RespondToModificationPayload,
  SendCollaborationRequestPayload,
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

  return [];
};

const mapCampaignApplication = (item: unknown): CampaignRequest | null => {
  if (!isObject(item)) return null;
  return item as CampaignRequest;
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

  async getAllCampaignApplications(): Promise<CampaignApplicationsResponse> {
    const campaignsResponse = await this.getCampaigns();
    const campaigns = campaignsResponse.data ?? [];

    const applicationResponses = await Promise.all(
      campaigns.map((campaign) => this.getCampaignApplications(campaign.id)),
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
    return response.data;
  },

  async getCompanyCollaborationRequests(): Promise<CollaborationRequestResponse> {
    const response = await api.get("/api/company/collaboration-requests");
    return response.data;
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
};
