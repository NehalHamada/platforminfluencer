import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import type { InfluencerDashboardResponse } from "@/types/dashboard.types";

export function useInfluencerDashboard() {
  const [data, setData] = useState<InfluencerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await dashboardService.getInfluencerDashboard();
      setData(result);
    } catch {
      setError("failed_to_load_dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
