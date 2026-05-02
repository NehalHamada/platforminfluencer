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
import { logOtpFromResponse } from "@/utils/logOtp";
import { setPendingAuth } from "@/utils/pendingAuth";

function useAuth() {
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const register = async (data: SharedRegisterData) => {
    const response = await registerMutation.mutateAsync(data);
    logOtpFromResponse("register otp:", response);
    setPendingAuth(response.data);
    sessionStorage.setItem(
      "otpPurpose",
      `${response.data.user.type}-register`,
    );
    localStorage.setItem("otpEmail", data.email);
    navigate("/verify-otp");
  };

  const login = async (data: LoginPayload) => {
    const response = await loginMutation.mutateAsync(data);
    logOtpFromResponse("login otp:", response);
    setPendingAuth(response.data);
    sessionStorage.setItem("otpPurpose", "login-verification");
    localStorage.setItem("otpEmail", data.email);
    navigate("/verify-otp");
  };

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = () => {
    sessionStorage.setItem("logoutRedirect", "home");
    clearAuth();
    window.location.replace("/");
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
