import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard.service";
import type { InfluencerDiscoveryQueryParams } from "@/types/dashboard.types";

export function useInfluencerDiscoveryQuery(
  params: InfluencerDiscoveryQueryParams,
) {
  return useQuery({
    queryKey: ["influencer-discovery", params],
    queryFn: () => dashboardService.getInfluencerDiscovery(params),
  });
}
