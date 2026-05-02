import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { AuthResponse, SharedRegisterData } from "@/types/auth.types";

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, SharedRegisterData>({
    mutationFn: authService.register,
  });
}
