import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { CompanyHomeResponse } from "@/types/dashboard.types";

export function useCompanyHomeQuery() {
  return useQuery<CompanyHomeResponse, Error>({
    queryKey: queryKeys.dashboard.companyHome(),
    queryFn: dashboardService.getCompanyHome,
  });
}
