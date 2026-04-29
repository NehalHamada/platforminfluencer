import { aboutService } from "@/services/about.service";
import { useQuery } from "@tanstack/react-query";

export function useAboutUsQuery() {
  return useQuery({
    queryKey: ["about-us"],
    queryFn: aboutService.getAboutUS,
  });
}
