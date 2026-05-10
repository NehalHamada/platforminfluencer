import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useEngagementRatesQuery() {
  return useQuery({
    queryKey: ["master-data", "engagement-rates"] as const,
    queryFn: masterDataService.getEngagementRates,
  });
}
