import { authService } from "@/services/auth.service";
import type { ResetPasswordPayload } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export function useResetPasswordMutation() {
  return useMutation<void, Error, ResetPasswordPayload>({
    mutationFn: authService.resetPassword,
  });
}
