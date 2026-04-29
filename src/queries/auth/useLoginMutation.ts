import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse, LoginPayload } from "@/types/auth.types";

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authService.login,

    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth({ user, token });
    },
  });
}
