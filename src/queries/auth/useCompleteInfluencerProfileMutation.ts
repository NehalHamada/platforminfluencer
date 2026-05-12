import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { setPendingAuth } from "@/utils/pendingAuth";
import type {
  SharedRegisterData,
  CompleteInfluencerProfilePayload,
  InfluencerStepPayload,
} from "@/types/auth.types";

type Payload = {
  registerData: SharedRegisterData;
  influencerStepData: InfluencerStepPayload;
  completeProfileData: CompleteInfluencerProfilePayload;
};

export function useCompleteInfluencerProfileMutation() {
  return useMutation({
    mutationFn: async ({
      registerData,
      influencerStepData,
      completeProfileData,
    }: Payload) => {
      const registerResponse = await authService.register({
        ...registerData,
        ...influencerStepData,
      });
      setPendingAuth({
        user: registerResponse.data.user,
        token: registerResponse.data.token,
      });

      const previousToken = sessionStorage.getItem("token");
      sessionStorage.setItem("token", registerResponse.data.token);

      try {
        await authService.completeInfluencerProfile(completeProfileData);
      } finally {
        if (previousToken) {
          sessionStorage.setItem("token", previousToken);
        } else {
          sessionStorage.removeItem("token");
        }
      }

      return registerResponse;
    },
  });
}
