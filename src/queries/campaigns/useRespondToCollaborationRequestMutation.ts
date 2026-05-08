import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import { getConversationIdFromResponse } from "@/utils/apiResponse";

// Removed unused Variables

export function useRespondToCollaborationRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { requestId: string | number; status: "accepted" | "rejected" }>({
    mutationFn: ({ requestId, status }) =>
      campaignService.respondToCollaborationRequest(requestId, status),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        ["campaigns", "collaboration-requests"],
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;

          const responseData = oldData as {
            data?: Array<Record<string, unknown>>;
          };

          if (!Array.isArray(responseData.data)) return oldData;

          const conversationId = getConversationIdFromResponse(response);

          return {
            ...responseData,
            data: responseData.data.map((request) =>
              String(request.id) === String(variables.requestId)
                ? {
                    ...request,
                    status: variables.status,
                    conversation_id:
                      conversationId ?? request.conversation_id,
                  }
                : request,
            ),
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "collaboration-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["campaigns", "company-collaboration-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencer(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.company(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
}
