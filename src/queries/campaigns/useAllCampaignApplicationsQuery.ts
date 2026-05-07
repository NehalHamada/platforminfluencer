import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import type { CampaignApplicationsResponse } from "@/types/campaign.types";

export function useAllCampaignApplicationsQuery(enabled = true) {
  return useQuery<CampaignApplicationsResponse, Error>({
    queryKey: queryKeys.campaigns.allApplications(),
    queryFn: () => campaignService.getAllCampaignApplications(),
    enabled,
  });
}
