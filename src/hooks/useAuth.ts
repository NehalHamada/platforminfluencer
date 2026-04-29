import { useNavigate } from "react-router-dom";

import { authService } from "@/services/auth.service";
import { useLoginMutation } from "@/queries/auth/useLoginMutation";
import { useRegisterMutation } from "@/queries/auth/useRegisterMutation";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  SharedRegisterData,
  VerifyOtpPayload,
} from "@/types/auth.types";
import { useAuthStore } from "@/store/auth.store";

function useAuth() {
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const register = async (data: SharedRegisterData) => {
    const response = await registerMutation.mutateAsync(data);

    if (response.data.user.type === "company") {
      navigate("/dashboard/company");
    } else {
      navigate("/dashboard/influencer");
    }
  };

  const login = async (data: LoginPayload) => {
    const response = await loginMutation.mutateAsync(data);
    if (response.data.user.type === "company") {
      navigate("/dashboard/company");
    } else {
      navigate("/dashboard/influencer");
    }
  };

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const forgotPassword = async (data: ForgotPasswordPayload) => {
    return await authService.forgotPassword(data);
  };

  const verifyOtp = async (data: VerifyOtpPayload) => {
    return await authService.verifyOtp(data);
  };

  const resetPassword = async (data: ResetPasswordPayload) => {
    return await authService.resetPassword(data);
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    forgotPassword,
    verifyOtp,
    resetPassword,
    isLoading: registerMutation.isPending || loginMutation.isPending,
  };
}

export default useAuth;
