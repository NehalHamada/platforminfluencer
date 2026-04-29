import { useQuery } from "@tanstack/react-query";

import { masterDataService } from "@/services/masterData.service";

export function useContentTypesQuery() {
  return useQuery({
    queryKey: ["master-data", "content-types"],
    queryFn: masterDataService.getContentType,
  });
}
