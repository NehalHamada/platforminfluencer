import { authClients } from "@/lib/axios";
import type { LandingResponse } from "@/types/landing.types";

export const landingServices = {
  getLandingPage: async (lang: string) => {
    const reponse = await authClients.get<LandingResponse>(
      "/api/landing-page",
      {
        params: {
          lang,
        },
        headers: {
          "Accept-Language": lang,
          "X-Skip-Auth": "true",
        },
      },
    );
    return reponse.data.data;
  },
};
