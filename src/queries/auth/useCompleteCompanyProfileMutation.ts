import { queryKeys } from "@/constants/queryKeys";
import { authService } from "@/services/auth.service";
import type { CompleteCompanyProfilePayload } from "@/types/auth.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCompleteCompanyProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CompleteCompanyProfilePayload>({
    mutationFn: authService.completeCompanyProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me(),
      });
    },
  });
}
