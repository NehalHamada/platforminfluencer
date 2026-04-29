import { z } from "zod";

export const offerSchema = z.object({
  proposedPrice: z.string().min(1, "offer.proposedPriceRequired"),
  companyNote: z.string().min(1, "offer.companyNoteRequired"),
  executionTime: z.string().min(1, "offer.executionTimeRequired"),
  guarantee: z.string().min(1, "offer.guaranteeRequired"),
});

export type OfferSchema = z.infer<typeof offerSchema>;
