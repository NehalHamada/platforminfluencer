import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { campaignService } from "@/services/campaign.service";
import { getConversationIdFromResponse } from "@/utils/apiResponse";

// Removed unused Variables

export function useUpdateApplicationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { applicationId: string | number; status: "accepted" | "rejected" },
    { previousAllApps: unknown }
  >({
    mutationFn: ({ applicationId, status }) =>
      campaignService.updateApplicationStatus(applicationId, status),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["campaigns", "applications"] });
      await queryClient.cancelQueries({ queryKey: queryKeys.campaigns.allApplications() });
      await queryClient.cancelQueries({ queryKey: queryKeys.campaigns.myApplications() });

      // Snapshot the previous value
      const previousAllApps = queryClient.getQueryData(queryKeys.campaigns.allApplications());

      const updateData = (oldData: unknown) => {
        if (!oldData || typeof oldData !== "object") return oldData;
        const responseData = oldData as { data?: Array<Record<string, unknown>> };
        if (!Array.isArray(responseData.data)) return oldData;

        return {
          ...responseData,
          data: responseData.data.map((application) =>
            String(application.id) === String(variables.applicationId)
              ? { ...application, status: variables.status }
              : application,
          ),
        };
      };

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ["campaigns", "applications"] }, updateData);
      queryClient.setQueryData(queryKeys.campaigns.allApplications(), updateData);
      queryClient.setQueryData(queryKeys.campaigns.myApplications(), updateData);

      return { previousAllApps };
    },
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
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAllApps) {
        queryClient.setQueryData(queryKeys.campaigns.allApplications(), context.previousAllApps);
      }
    },
    onSettled: () => {
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
