import { api } from "@/lib/axios";
import type {
  CompanyDashboardResponse,
  ConvertCampaignPayload,
  ConvertCampaignResponse,
  InfluencerChatPayload,
  InfluencerChatResponse,
  InfluencerDashboardResponse,
} from "@/types/dashboard.types";

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
};
