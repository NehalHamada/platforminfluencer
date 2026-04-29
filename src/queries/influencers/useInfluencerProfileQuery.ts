import { queryKeys } from "@/constants/queryKeys";
import { influencerService } from "@/services/influencer.service";
import type { InfluencerProfileResponse } from "@/types/influencer.types";
import { useQuery } from "@tanstack/react-query";

export function useInfluencerProfileQuery(influencerId: string) {
  return useQuery<InfluencerProfileResponse, Error>({
    queryKey: queryKeys.influencers.profile(influencerId),
    queryFn: () => influencerService.getInfluencerProfile(influencerId),
    enabled: Boolean(influencerId),
  });
}
