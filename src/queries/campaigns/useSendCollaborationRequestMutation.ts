import { useMutation, useQueryClient } from "@tanstack/react-query";

import { campaignService } from "@/services/campaign.service";
import type { SendCollaborationRequestPayload } from "@/types/campaign.types";

export function useSendCollaborationRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    {
      influencerId: string | number;
      payload: SendCollaborationRequestPayload;
    }
  >({
    mutationFn: ({ influencerId, payload }) =>
      campaignService.sendCollaborationRequest(influencerId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "company-collaboration-requests"],
      });
    },
  });
}
