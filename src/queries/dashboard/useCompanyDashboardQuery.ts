import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { CompanyDashboardResponse } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

export function useCompanyDashboardQuery() {
  return useQuery<CompanyDashboardResponse, Error>({
    queryKey: queryKeys.dashboard.company(),
    queryFn: dashboardService.getCompanyDashboard,
  });
}
