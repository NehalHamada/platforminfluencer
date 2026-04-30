import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import type { CampaignApplicationsResponse } from "@/types/campaign.types";

export function useCampaignApplicationsQuery(campaignId: string | number) {
  return useQuery<CampaignApplicationsResponse, Error>({
    queryKey: queryKeys.campaigns.applications(campaignId),
    queryFn: () => campaignService.getCampaignApplications(campaignId),
  });
}
