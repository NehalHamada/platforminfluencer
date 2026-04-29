export const getOtpFromResponse = (value: unknown): unknown => {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  const directOtp =
    record.otp ??
    record.OTP ??
    record.code ??
    record.verification_code ??
    record.verificationCode ??
    record.verify_code ??
    record.verifyCode;

  if (directOtp) return directOtp;

  for (const key of Object.keys(record)) {
    const nestedOtp = getOtpFromResponse(record[key]);

    if (nestedOtp) return nestedOtp;
  }

  return undefined;
};

export const logOtpFromResponse = (label: string, response: unknown) => {
  const otp = getOtpFromResponse(response);

  console.log(label, otp ?? response);
};
