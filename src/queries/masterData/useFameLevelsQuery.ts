import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useFameLevelsQuery() {
  return useQuery({
    queryKey: ["master-data", "fame-levels"] as const,
    queryFn: masterDataService.getFameLevels,
  });
}
