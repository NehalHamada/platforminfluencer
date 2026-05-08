import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import { getConversationIdFromResponse } from "@/utils/apiResponse";

// Removed unused Variables

export function useUpdateApplicationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { applicationId: string | number; status: "accepted" | "rejected" }>({
    mutationFn: ({ applicationId, status }) =>
      campaignService.updateApplicationStatus(applicationId, status),
    onSuccess: (response, variables) => {
      const updateApplications = (oldData: unknown) => {
        if (!oldData || typeof oldData !== "object") return oldData;

        const responseData = oldData as {
          data?: Array<Record<string, unknown>>;
        };

        if (!Array.isArray(responseData.data)) return oldData;

        const conversationId = getConversationIdFromResponse(response);

        return {
          ...responseData,
          data: responseData.data.map((application) =>
            String(application.id) === String(variables.applicationId)
              ? {
                  ...application,
                  status: variables.status,
                  conversation_id:
                    conversationId ?? application.conversation_id,
                }
              : application,
          ),
        };
      };

      queryClient.setQueriesData(
        { queryKey: ["campaigns", "applications"] },
        updateApplications,
      );
      queryClient.setQueryData(
        queryKeys.campaigns.allApplications(),
        updateApplications,
      );
      queryClient.setQueryData(
        queryKeys.campaigns.myApplications(),
        updateApplications,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.allApplications(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.myApplications(),
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
