import { useQuery } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";
import { queryKeys } from "@/constants/queryKeys";
import type {
  CampaignRequestsResponse,
  CampaignRequestsQueryParams,
} from "@/types/campaign.types";

export function useCampaignRequestsQuery(params?: CampaignRequestsQueryParams) {
  return useQuery<CampaignRequestsResponse, Error>({
    queryKey: queryKeys.campaigns.myApplications(params),
    queryFn: () => campaignService.getMyApplications(params),
    refetchOnWindowFocus: true,
  });
}
