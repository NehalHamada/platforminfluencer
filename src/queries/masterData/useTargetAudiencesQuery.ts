import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useTargetAudiencesQuery() {
  return useQuery({
    queryKey: ["master-data", "target-audiences"],
    queryFn: masterDataService.getTargetAudience,
  });
}
