import { useQuery } from "@tanstack/react-query";
import { offerService } from "@/services/offer.service";
import { queryKeys } from "@/constants/queryKeys";
import type { OffersQueryParams, OffersResponse } from "@/types/offer.types";

export function useOffersQuery(params?: OffersQueryParams) {
  return useQuery<OffersResponse, Error>({
    queryKey: queryKeys.offers.list(params),
    queryFn: () => offerService.getOffers(params),
  });
}
