import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { EarningsResponse } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

export function useInfluencerEarningsQuery() {
  return useQuery<EarningsResponse, Error>({
    queryKey: queryKeys.dashboard.influencerEarnings(),
    queryFn: dashboardService.getInfluencerEarnings,
  });
}
