import type { LandingSection } from "@/types/landing.types";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const getString = (
  value: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const item = value?.[key];
  return typeof item === "string" && item.trim() ? item : null;
};

export const sectionText = (
  section: LandingSection | null | undefined,
  field: "title" | "description",
  fallback: string,
  useApiText = true,
) => (useApiText ? section?.[field] || fallback : fallback);
