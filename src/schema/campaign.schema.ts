import { z } from "zod";

export const campaignSchema = z.object({
  campaignName: z.string().min(1, "errors.campaignNameRequired"),
  campaignIdea: z.string().min(1, "errors.campaignIdeaRequired"),
  platform: z.string().min(1, "errors.platformRequired"),
  targetAge: z.string().min(1, "errors.targetAgeRequired"),
  targetCountry: z.string().min(1, "errors.targetCountryRequired"),
  campaignDuration: z.string().min(1, "errors.campaignDurationRequired"),
  campaignType: z.string().min(1, "errors.campaignTypeRequired"),
  estimatedBudget: z.string().min(1, "errors.estimatedBudgetRequired"),
  influencersCount: z.string().min(1, "errors.influencersCountRequired"),
});

export type CampaignSchema = z.infer<typeof campaignSchema>;
