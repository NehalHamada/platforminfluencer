import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  SharedRegisterData,
  CompleteInfluencerProfilePayload,
} from "@/types/auth.types";

type Payload = {
  registerData: SharedRegisterData;
  completeProfileData: CompleteInfluencerProfilePayload;
};

export function useCompleteInfluencerProfileMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ registerData, completeProfileData }: Payload) => {
      const registerResponse = await authService.register(registerData);
      setAuth({
        user: registerResponse.data.user,
        token: registerResponse.data.token,
      });

      await authService.completeInfluencerProfile(completeProfileData);

      return registerResponse;
    },
  });
}
