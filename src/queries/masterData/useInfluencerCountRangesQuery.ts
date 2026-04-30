import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useInfluencerCountRangesQuery() {
  return useQuery({
    queryKey: ["master-data", "influencer-count-ranges"],
    queryFn: masterDataService.getInfluencerCountRange,
  });
}
