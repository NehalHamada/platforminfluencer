import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  SharedRegisterData,
  InfluencerStepPayload,
  CompleteInfluencerProfilePayload,
} from "@/types/auth.types";

type Payload = {
  registerData: SharedRegisterData;
  influencerStepData: InfluencerStepPayload;
  completeProfileData: CompleteInfluencerProfilePayload;
};

export function useCompleteInfluencerProfileMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({
      registerData,
      influencerStepData,
      completeProfileData,
    }: Payload) => {
      const registerResponse = await authService.registerInfluencerStep({
        ...registerData,
        platform_ids: influencerStepData.platform_ids,
        follower_range_ids: influencerStepData.follower_range_ids,
        content_type_ids: influencerStepData.content_type_ids,
      });

      setAuth({
        user: registerResponse.data.user,
        token: registerResponse.data.token,
      });

      await authService.completeInfluencerProfile(completeProfileData);

      return registerResponse;
    },
  });
}
