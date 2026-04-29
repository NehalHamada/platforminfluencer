import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offerService } from "@/services/offer.service";
import { queryKeys } from "@/constants/queryKeys";
import type {
  AcceptOfferPayload,
  AcceptOfferResponse,
} from "@/types/offer.types";

export function useAcceptOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation<AcceptOfferResponse, Error, AcceptOfferPayload>({
    mutationFn: offerService.acceptOffer,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.offers.list(),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencer(),
      });
    },
  });
}
