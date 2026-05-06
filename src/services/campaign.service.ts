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
  UpdateApplicationStatusPayload,
  ApproveContentPayload,
  RequestModificationPayload,
  CollaborationRequestResponse,
  RespondToCollabPayload,
  RespondToModificationPayload,
} from "@/types/campaign.types";

type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

/*
const getNumber = (value: unknown) => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numberValue) ? numberValue : undefined;
};
*/

/*
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
*/

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
    payload: UpdateApplicationStatusPayload,
  ) {
    const response = await api.patch(
      `/api/applications/${applicationId}/status`,
      payload,
    );
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

  async respondToCollaborationRequest(
    requestId: string | number,
    payload: RespondToCollabPayload,
  ) {
    const response = await api.patch(
      `/api/influencer/collaboration-requests/${requestId}/respond`,
      payload,
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
