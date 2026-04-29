import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import type { CampaignDetailsResponse } from "@/types/campaign.types";
import { useQuery } from "@tanstack/react-query";

export function useCampaignDetailsQuery(campaignId: string) {
  return useQuery<CampaignDetailsResponse, Error>({
    queryKey: queryKeys.campaigns.details(campaignId),
    queryFn: () => campaignService.getCampaignById(campaignId),
    enabled: Boolean(campaignId),
  });
}
