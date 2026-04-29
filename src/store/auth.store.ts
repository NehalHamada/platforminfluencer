import type { AuthStore } from "@/types/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: ({ user, token }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage",
    },
  ),
);
