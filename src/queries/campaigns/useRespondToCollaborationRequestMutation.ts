import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";

// Removed unused Variables

export function useRespondToCollaborationRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { requestId: string | number; status: "accepted" | "rejected" }>({
    mutationFn: ({ requestId, status }) =>
      campaignService.respondToCollaborationRequest(requestId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "collaboration-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
}
