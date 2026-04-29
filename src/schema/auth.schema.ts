import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "errors.email_required")
  .pipe(z.email("errors.invalid_email"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "errors.password_min"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "errors.name"),
    email: emailSchema,
    password: z.string().min(8, "errors.password_min"),
    confirmPassword: z.string().min(2, "errors.confirm_password_required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwords_not_match",
    path: ["confirmPassword"],
  });

export const influencerSchema = z.object({
  platform_ids: z.array(z.string()).min(1, "errors.platform_required"),
  follower_range_id: z.string().min(1, "errors.followers_required"),
  content_type_id: z.string().min(1, "errors.content_type_required"),
});

export const companySchema = z.object({
  companyName: z.string().min(1, "company.validation.company_name_required"),
  managerName: z.string().min(1, "company.validation.manager_name_required"),
  field: z.string().min(1, "errors.field_required"),
  country: z.string().min(1, "errors.country_required"),
});

export const completeCompanySchema = z.object({
  field: z.string().min(1, "errors.field_required"),
  phone: z.string().min(1, "errors.phone_required"),
  commercialRegister: z.instanceof(File, {
    message: "errors.commercial_register_required",
  }),
  platformIds: z.array(z.number()).min(1, "errors.platform_required"),
  contentTypeIds: z.array(z.number()).min(1, "errors.content_type_required"),
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "errors.accept_terms_required",
  }),
});

export const completeInfluencerSchema = z.object({
  phone: z.string().min(1, "errors.phone_required"),
  cooperationType: z.string().min(1, "errors.cooperation_type_required"),
  contentField: z.string().min(1, "errors.content_field_required"),
  platformAccounts: z
    .array(
      z.object({
        platform_id: z.string().min(1, "errors.platform"),
        accountLink: z.string().min(1, "errors.account_link_required"),
      }),
    )
    .min(1, "errors.platform"),
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "errors.accept_terms_required",
  }),
});

export const completeInfluencerPaymentSchema = z.object({
  postPrice: z.string().min(1, "errors.post_price_required"),
  storyPrice: z.string().min(1, "errors.story_price_required"),
  reelPrice: z.string().min(1, "errors.reel_price_required"),
  isNegotiable: z.boolean(),
  payoutMethod: z.enum(["bank", "wallet"]),
  accountHolder: z.string().optional(),
  bankName: z.string().optional(),
  iban: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
});

export const forgetPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  otp: z.string().min(6, "errors.otp_required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "errors.password_min"),
    password_confirmation: z
      .string()
      .min(6, "errors.confirm_password_required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "errors.passwords_not_match",
    path: ["password_confirmation"],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type CompanySchemaType = z.infer<typeof companySchema>;
export type InfluencerSchemaType = z.infer<typeof influencerSchema>;
export type CompleteInfluencerSchemaType = z.infer<
  typeof completeInfluencerSchema
>;
export type ForgotPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;
export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type CompleteInfluencerPaymentSchemaType = z.infer<
  typeof completeInfluencerPaymentSchema
>;
export type CompleteCompanySchemaType = z.infer<typeof completeCompanySchema>;
