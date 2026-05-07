import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";

// Removed unused Variables

export function useUpdateApplicationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { applicationId: string | number; status: "accepted" | "rejected" }>({
    mutationFn: ({ applicationId, status }) =>
      campaignService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.allApplications(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
}
