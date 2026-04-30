import { z } from "zod";

export const offerSchema = z.object({
  price: z.string().min(1, "offer.proposedPriceRequired"),
  note: z.string().min(1, "offer.companyNoteRequired"),
  execution_date: z.string().min(1, "offer.executionTimeRequired"),
  is_ready: z.string().min(1, "offer.guaranteeRequired"),
});

export type OfferSchema = z.infer<typeof offerSchema>;
