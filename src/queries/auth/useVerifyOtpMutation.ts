import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { VerifyOtpPayload } from "@/types/auth.types";

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => authService.verifyOtp(data),
  });
}
