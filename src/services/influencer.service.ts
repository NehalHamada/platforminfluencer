import { api } from "@/lib/axios";
import type {
  InfluencerListResponse,
  InfluencerProfileResponse,
  InfluencersQueryParams,
} from "@/types/influencer.types";

export const influencerService = {
  async getInfluencers(
    params?: InfluencersQueryParams,
  ): Promise<InfluencerListResponse> {
    const response = await api.get("/influencers", {
      params,
    });

    return response.data;
  },

  async getInfluencerProfile(
    influencerId: string,
  ): Promise<InfluencerProfileResponse> {
    const response = await api.get(`/influencers/${influencerId}`);

    return response.data;
  },
};
