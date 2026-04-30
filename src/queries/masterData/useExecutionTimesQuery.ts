import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useExecutionTimesQuery() {
  return useQuery({
    queryKey: ["master-data", "execution-times"],
    queryFn: masterDataService.getExecutionTime,
  });
}
