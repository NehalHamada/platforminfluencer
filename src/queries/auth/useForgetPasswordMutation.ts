import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { ForgotPasswordPayload } from "@/types/auth.types";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  });
}
