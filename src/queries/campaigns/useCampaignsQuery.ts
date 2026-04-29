import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import type {
  CampaignListResponse,
  CampaignQueryParams,
} from "@/types/campaign.types";
import { useQuery } from "@tanstack/react-query";

export function useCampaignsQuery(params?: CampaignQueryParams) {
  return useQuery<CampaignListResponse, Error>({
    queryKey: queryKeys.campaigns.list(params),
    queryFn: () => campaignService.getCampaigns(params),
  });
}
