import type { UiStore } from "@/types/ui.types";
import { create } from "zustand";

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isGlobalLoading: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
}));
