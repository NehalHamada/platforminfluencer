import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useCampaignTypesQuery() {
  return useQuery({
    queryKey: ["master-data", "campaign-types"],
    queryFn: masterDataService.getCampaignType,
  });
}
