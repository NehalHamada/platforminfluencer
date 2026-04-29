import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse, SharedRegisterData } from "@/types/auth.types";

export function useRegisterMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, SharedRegisterData>({
    mutationFn: authService.register,
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth({ user, token });
    },
  });
}
