import { authClients } from "@/lib/axios";
import type {
  AuthResponse,
  CompanyStepPayload,
  CompleteCompanyProfilePayload,
  CompleteInfluencerProfilePayload,
  ForgotPasswordPayload,
  InfluencerStepPayload,
  LoginPayload,
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

  registerInfluencerStep: async (
    data: InfluencerStepPayload,
  ): Promise<AuthResponse> => {
    const response = await authClients.post("/api/register/influencer", data);

    return response.data;
  },

  completeInfluencerProfile: async (data: CompleteInfluencerProfilePayload) => {
    const response = await authClients.post(
      "/api/influencer/complete-profile",
      data,
    );

    return response.data;
  },

  registerCompanyStep: async (data: CompanyStepPayload) => {
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
    const response = await authClients.post("/api/verify-otp", data);

    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await authClients.post("/api/reset-password", data);
    return response.data;
  },
};
