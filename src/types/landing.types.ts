export type LandingSection = {
  id: number;
  key: string;
  title: string | null;
  description: string | null;
  content: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type LandingData = {
  hero: LandingSection;
};

export type LandingResponse = {
  success: boolean;
  data: LandingData;
};
