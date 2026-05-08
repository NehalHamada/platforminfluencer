import { useQuery } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";
import type { CollaborationRequestResponse } from "@/types/campaign.types";

export function useCollaborationRequestsQuery() {
  return useQuery<CollaborationRequestResponse, Error>({
    queryKey: ["campaigns", "collaboration-requests"],
    queryFn: () => campaignService.getCollaborationRequests(),
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
}
