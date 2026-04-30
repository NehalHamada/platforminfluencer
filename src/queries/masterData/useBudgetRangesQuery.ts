import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useBudgetRangesQuery() {
  return useQuery({
    queryKey: ["master-data", "budget-ranges"],
    queryFn: masterDataService.getBudgetRange,
  });
}
