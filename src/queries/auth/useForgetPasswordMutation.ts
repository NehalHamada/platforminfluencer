import { authService } from "@/services/auth.service";
import type { ForgotPasswordPayload } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export function useForgetPasswordMutation() {
  return useMutation<void, Error, ForgotPasswordPayload>({
    mutationFn: authService.forgotPassword,
  });
}
