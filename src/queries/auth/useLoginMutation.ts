import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse, LoginPayload } from "@/types/auth.types";

export function useLoginMutation() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authService.login,
    onMutate: () => {
      clearAuth();
    },
  });
}
