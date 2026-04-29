import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { ResendOtpPayload } from "@/types/auth.types";

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (data: ResendOtpPayload) => authService.resendOtp(data),
  });
}
