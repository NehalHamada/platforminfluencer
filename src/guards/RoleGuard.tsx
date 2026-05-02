import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/auth.types";
import { Outlet, Navigate } from "react-router-dom";

type RoleGuardProps = {
  allowedRoles: UserRole[];
};

function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    if (sessionStorage.getItem("logoutRedirect") === "home") {
      sessionStorage.removeItem("logoutRedirect");
      return <Navigate to="/" replace />;
    }

    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.indexOf(user.type) === -1) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
