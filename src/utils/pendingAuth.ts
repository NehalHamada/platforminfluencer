import type { AuthUser } from "@/types/auth.types";

type PendingAuth = {
  user: AuthUser;
  token: string;
};

const PENDING_AUTH_KEY = "pendingAuth";

export const setPendingAuth = (payload: PendingAuth) => {
  sessionStorage.setItem(PENDING_AUTH_KEY, JSON.stringify(payload));
};

export const getPendingAuth = (): PendingAuth | null => {
  const value = sessionStorage.getItem(PENDING_AUTH_KEY);

  if (!value) return null;

  try {
    const parsedValue = JSON.parse(value) as Partial<PendingAuth>;

    if (!parsedValue.user || !parsedValue.token) return null;

    return {
      user: parsedValue.user,
      token: parsedValue.token,
    };
  } catch {
    return null;
  }
};

export const clearPendingAuth = () => {
  sessionStorage.removeItem(PENDING_AUTH_KEY);
};
