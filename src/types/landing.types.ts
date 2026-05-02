export type LandingSection = {
  id: number;
  key: string;
  title: string | null;
  description: string | null;
  content: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type LandingCollection<T = Record<string, unknown>> = {
  info: LandingSection | null;
  posts?: T[];
  users?: T[];
};

export type LandingData = {
  hero: LandingSection;
  part2: LandingSection | null;
  success_results: LandingCollection;
  famous_influencers: LandingCollection;
  impact_campaigns: LandingCollection;
  platform_overview: LandingSection | null;
  latest_stars: LandingCollection;
  part8: LandingSection | null;
  our_diff: LandingSection | null;
  trusted_by: LandingSection | null;
  footer_info: LandingSection | null;
};

export type LandingResponse = {
  success: boolean;
  data: LandingData;
};
