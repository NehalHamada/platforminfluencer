import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { InfluencerDashboardResponse } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

export function useInfluencerDashboardQuery() {
  return useQuery<InfluencerDashboardResponse, Error>({
    queryKey: queryKeys.dashboard.influencer(),
    queryFn: dashboardService.getInfluencerDashboard,
  });
}
