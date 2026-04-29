export type OfferPayload = {
  proposedPrice: string;
  companyNote: string;
  executionTime: string;
  guarantee: string;
};

export type CreateOfferResponse = {
  message: string;
  data?: {
    id: string;
    proposedPrice: string;
  };
};

export type Offer = {
  id: string;
  proposedPrice: string;
  companyNote: string;
  executionTime: string;
  guarantee: string;
  status: "pending" | "accepted" | "rejected";
  companyName?: string;
  influencerName?: string;
  createdAt?: string;
};

export type OffersResponse = {
  message?: string;
  data: Offer[];
  total?: number;
  page?: number;
  limit?: number;
};

export type OffersQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type AcceptOfferPayload = {
  offerId: string;
};

export type AcceptOfferResponse = {
  message: string;
  data: Offer;
};
