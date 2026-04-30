import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().min(1, "errors.campaignNameRequired"),
  idea: z.string().min(1, "errors.campaignIdeaRequired"),
  platform_id: z.string().min(1, "errors.platformRequired"),
  target_audience_id: z.string().min(1, "errors.targetAgeRequired"),
  target_location_id: z.string().min(1, "errors.targetCountryRequired"),
  execution_time_id: z.string().min(1, "errors.campaignDurationRequired"),
  campaign_type_id: z.string().min(1, "errors.campaignTypeRequired"),
  budget_range_id: z.string().min(1, "errors.estimatedBudgetRequired"),
  influencer_count_range_id: z
    .string()
    .min(1, "errors.influencersCountRequired"),
});

export type CampaignSchema = z.infer<typeof campaignSchema>;
