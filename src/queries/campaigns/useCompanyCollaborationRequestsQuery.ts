import { useQuery } from "@tanstack/react-query";

import { campaignService } from "@/services/campaign.service";
import type { CollaborationRequestResponse } from "@/types/campaign.types";

export function useCompanyCollaborationRequestsQuery(enabled = true) {
  return useQuery<CollaborationRequestResponse, Error>({
    queryKey: ["campaigns", "company-collaboration-requests"],
    queryFn: () => campaignService.getCompanyCollaborationRequests(),
    enabled,
    refetchOnWindowFocus: true,
  });
}
