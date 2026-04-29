import { api } from "@/lib/axios";
import type {
  CampaignPayload,
  CampaignResponse,
  CampaignListResponse,
  CampaignDetailsResponse,
  CampaignQueryParams,
  CampaignRequestsResponse,
  CampaignRequestsQueryParams,
} from "@/types/campaign.types";

export const campaignService = {
  async createCampaign(data: CampaignPayload): Promise<CampaignResponse> {
    const response = await api.post("/campaigns", data);
    return response.data;
  },

  async getCampaigns(
    params?: CampaignQueryParams,
  ): Promise<CampaignListResponse> {
    const response = await api.get("/campaigns", { params });
    return response.data;
  },

  async getCampaignById(campaignId: string): Promise<CampaignDetailsResponse> {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data;
  },

  async getCampaignRequests(
    params?: CampaignRequestsQueryParams,
  ): Promise<CampaignRequestsResponse> {
    const response = await api.get("/campaigns/requests", {
      params,
    });
    return response.data;
  },
};
