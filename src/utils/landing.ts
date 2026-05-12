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

export const isUsableImageUrl = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("example.com");

export const getImageList = (
  value: Record<string, unknown> | null | undefined,
  key = "images",
) => {
  const images = value?.[key];

  return Array.isArray(images) ? images.filter(isUsableImageUrl) : [];
};

export const getImage = (
  value: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const image = value?.[key];
  return isUsableImageUrl(image) ? image : null;
};

export const sectionText = (
  section: LandingSection | null | undefined,
  field: "title" | "description",
  fallback: string,
  useApiText = true,
) => (useApiText ? section?.[field] || fallback : fallback);
