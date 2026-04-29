import { api } from "@/lib/axios";
import type {
  OfferPayload,
  CreateOfferResponse,
  OffersQueryParams,
  OffersResponse,
  AcceptOfferPayload,
  AcceptOfferResponse,
} from "@/types/offer.types";

export const offerService = {
  async createOffer(data: OfferPayload): Promise<CreateOfferResponse> {
    const response = await api.post("/offers", data);
    return response.data;
  },

  async getOffers(params?: OffersQueryParams): Promise<OffersResponse> {
    const response = await api.get("/offers", {
      params,
    });
    return response.data;
  },

  async acceptOffer(data: AcceptOfferPayload): Promise<AcceptOfferResponse> {
    const response = await api.patch(`/offers/${data.offerId}/accept`);
    return response.data;
  },
};
