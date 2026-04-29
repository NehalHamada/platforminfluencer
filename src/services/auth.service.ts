import { authClients } from "@/lib/axios";
import type {
  AuthResponse,
  CompanyStepRequestPayload,
  CompleteCompanyProfilePayload,
  CompleteInfluencerProfilePayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  SharedRegisterData,
  VerifyOtpPayload,
} from "@/types/auth.types";

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await authClients.post("/api/login", data);
    return response.data;
  },

  register: async (data: SharedRegisterData): Promise<AuthResponse> => {
    const response = await authClients.post("/api/register", data);

    return response.data;
  },

  completeInfluencerProfile: async (data: CompleteInfluencerProfilePayload) => {
    const response = await authClients.post(
      "/api/influencer/complete-profile",
      data,
    );

    return response.data;
  },

  registerCompanyStep: async (
    data: CompanyStepRequestPayload,
  ): Promise<AuthResponse> => {
    const response = await authClients.post("/api/register/company", data);
    return response.data;
  },

  completeCompanyProfile: async (data: CompleteCompanyProfilePayload) => {
    const response = await authClients.post(
      "/api/company/complete-profile",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await authClients.post("/api/forget-password", data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await authClients.post("/api/verify-otp", {
      ...data,
      code: data.otp,
      verification_code: data.otp,
    });

    return response.data;
  },

  resendOtp: async (data: ResendOtpPayload) => {
    const response = await authClients.post("/api/resend-otp", data);

    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await authClients.post("/api/reset-password", data);
    return response.data;
  },
};
