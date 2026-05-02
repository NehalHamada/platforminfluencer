import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { setPendingAuth } from "@/utils/pendingAuth";
import type {
  SharedRegisterData,
  CompleteInfluencerProfilePayload,
} from "@/types/auth.types";

type Payload = {
  registerData: SharedRegisterData;
  completeProfileData: CompleteInfluencerProfilePayload;
};

export function useCompleteInfluencerProfileMutation() {
  return useMutation({
    mutationFn: async ({ registerData, completeProfileData }: Payload) => {
      const registerResponse = await authService.register(registerData);
      setPendingAuth({
        user: registerResponse.data.user,
        token: registerResponse.data.token,
      });

      await authService.completeInfluencerProfile(completeProfileData);

      return registerResponse;
    },
  });
}
