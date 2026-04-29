import { landingServices } from "@/services/landing.service";
import { useQuery } from "@tanstack/react-query";

export function useLandingPageQuery(lang: string) {
  return useQuery({
    queryKey: ["landing-page", lang],
    queryFn: () => landingServices.getLandingPage(lang),
    staleTime: 0,
  });
}
