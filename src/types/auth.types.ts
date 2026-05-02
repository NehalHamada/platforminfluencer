export type UserRole = "company" | "influencer";

export type AuthUser = {
  id: number;
  name: string;
  type: UserRole;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: AuthUser; token: string }) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SharedRegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: UserRole;
};

export type InfluencerStepPayload = {
  platform_ids: number[];
  follower_range_ids: number[];
  content_type_ids: number[];
};

export type CompleteInfluencerProfilePayload = {
  phone: string;
  cooperation_type: string;
  content_field: string;
  price_post: number;
  price_story: number;
  price_reel: number;
  is_negotiable: boolean;
  platform_ids: number[];
  platform_links: string[];
  follower_range_ids: number[];
  content_type_ids: number[];
  account_holder_name: string;
  bank_name: string;
  iban: string;
  country: string;
  currency: string;
  accepted_terms: boolean;
};

export type CompanyRegisterPayload = SharedRegisterData;

export type CompanyStepPayload = {
  company_name: string;
  manager_name: string;
  field: string;
  country: string;
};

export type CompanyStepRequestPayload = SharedRegisterData &
  CompanyStepPayload;

export type CompleteCompanyProfilePayload = FormData;

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResendOtpPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
};
