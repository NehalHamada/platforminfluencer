import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import type {
  CampaignApplyPayload,
  CampaignApplyResponse,
} from "@/types/campaign.types";

type ApplyCampaignVariables = {
  campaignId: string | number;
  payload: CampaignApplyPayload;
};

export function useApplyCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation<CampaignApplyResponse, Error, ApplyCampaignVariables>({
    mutationFn: ({ campaignId, payload }) =>
      campaignService.applyToCampaign(campaignId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.details(String(variables.campaignId)),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencer(),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.myApplications(),
      });
    },
  });
}
