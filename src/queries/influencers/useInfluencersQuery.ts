import { queryKeys } from "@/constants/queryKeys";
import { influencerService } from "@/services/influencer.service";
import type {
  InfluencerListResponse,
  InfluencersQueryParams,
} from "@/types/influencer.types";
import { useQuery } from "@tanstack/react-query";

export function useInfluencersQuery(params?: InfluencersQueryParams) {
  return useQuery<InfluencerListResponse, Error>({
    queryKey: queryKeys.influencers.list(params),
    queryFn: () => influencerService.getInfluencers(params),
  });
}
