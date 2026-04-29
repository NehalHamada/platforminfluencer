import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function usePlatformsQuery() {
  return useQuery({
    queryKey: ["master-data", "platforms"],
    queryFn: masterDataService.getAllPlatforms,
  });
}
