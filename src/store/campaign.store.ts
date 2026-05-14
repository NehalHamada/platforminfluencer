import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CampaignState {
  rejectedCampaignIds: string[];
  addRejectedCampaignId: (id: string | number) => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      rejectedCampaignIds: [],
      addRejectedCampaignId: (id) =>
        set((state) => ({
          rejectedCampaignIds: Array.from(new Set([...state.rejectedCampaignIds, String(id)])),
        })),
    }),
    {
      name: "campaign-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
