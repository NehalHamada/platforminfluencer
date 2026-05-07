import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";
import { queryKeys } from "@/constants/queryKeys";
import type { CampaignPayload, CampaignResponse } from "@/types/campaign.types";

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation<CampaignResponse, Error, CampaignPayload>({
    mutationFn: campaignService.createCampaign,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.company(),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencer(),
      });
    },
  });
}
