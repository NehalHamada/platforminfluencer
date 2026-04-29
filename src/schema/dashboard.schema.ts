import { z } from "zod";

export const influencerChatSchema = z.object({
  campaignName: z.string().min(1, "errors.campaignNameRequired"),
  contentType: z.string().min(1, "errors.contentTypeRequired"),
  goal: z.string().min(1, "errors.goalRequired"),
  budget: z.string().min(1, "errors.budgetRequired"),
  executionDate: z.string().min(1, "errors.executionDateRequired"),
  message: z.string().min(1, "errors.messageRequired"),
});

export type InfluencerChatSchema = z.infer<typeof influencerChatSchema>;

export const convertCampaignSchema = z.object({
  contentNotes: z.string().min(1, "errors.contentNotesRequired"),
  finalPrice: z.string().min(1, "errors.finalPriceRequired"),
  deliverablesCount: z.string().min(1, "errors.deliverablesCountRequired"),
  deliveryDate: z.string().min(1, "errors.deliveryDateRequired"),
  agreementTerms: z.boolean().refine((val) => val === true, {
    message: "errors.agreementTermsRequired",
  }),
});

export type ConvertCampaignSchema = z.infer<typeof convertCampaignSchema>;
