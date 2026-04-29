import { authClients } from "@/lib/axios";
import type { AboutUsResponse } from "@/types/about.types";

export const aboutService = {
  getAboutUS: async () => {
    const response = await authClients.get<AboutUsResponse>("/api/about-us");
    return response.data.data;
  },
};
