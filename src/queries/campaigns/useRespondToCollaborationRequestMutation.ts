import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import { getConversationIdFromResponse } from "@/utils/apiResponse";

// Removed unused Variables

export function useRespondToCollaborationRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { requestId: string | number; status: "accepted" | "rejected" },
    { previousCollabs: unknown }
  >({
    mutationFn: ({ requestId, status }) =>
      campaignService.respondToCollaborationRequest(requestId, status),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["campaigns", "collaboration-requests"] });

      // Snapshot previous value
      const previousCollabs = queryClient.getQueryData(["campaigns", "collaboration-requests"]);

      const updateData = (oldData: unknown) => {
        if (!oldData || typeof oldData !== "object") return oldData;
        const responseData = oldData as { data?: Array<Record<string, unknown>> };
        if (!Array.isArray(responseData.data)) return oldData;

        return {
          ...responseData,
          data: responseData.data.map((request) =>
            String(request.id) === String(variables.requestId)
              ? { ...request, status: variables.status }
              : request,
          ),
        };
      };

      // Optimistically update
      queryClient.setQueryData(["campaigns", "collaboration-requests"], updateData);

      return { previousCollabs };
    },
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
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCollabs) {
        queryClient.setQueryData(["campaigns", "collaboration-requests"], context.previousCollabs);
      }
    },
    onSettled: () => {
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
