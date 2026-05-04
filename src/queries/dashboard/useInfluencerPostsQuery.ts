import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { InfluencerPostsResponse } from "@/types/dashboard.types";

export function useInfluencerPostsQuery() {
  return useQuery<InfluencerPostsResponse, Error>({
    queryKey: queryKeys.dashboard.influencerPosts(),
    queryFn: dashboardService.getInfluencerPosts,
  });
}
