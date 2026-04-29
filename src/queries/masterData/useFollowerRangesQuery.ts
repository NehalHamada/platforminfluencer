import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useFollowerRangesQuery() {
  return useQuery({
    queryKey: ["master-data", "follower-ranges"],
    queryFn: masterDataService.getFollowerRange,
  });
}
