import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useTargetLocationsQuery() {
  return useQuery({
    queryKey: ["master-data", "target-locations"],
    queryFn: masterDataService.getTargetLocation,
  });
}
