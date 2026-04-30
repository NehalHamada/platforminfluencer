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

  if (directOtp !== undefined && directOtp !== null && directOtp !== "") {
    return directOtp;
  }

  for (const key of Object.keys(record)) {
    const nestedOtp = getOtpFromResponse(record[key]);

    if (nestedOtp !== undefined && nestedOtp !== null && nestedOtp !== "") {
      return nestedOtp;
    }
  }

  return undefined;
};

export const logOtpFromResponse = (label: string, response: unknown) => {
  const otp = getOtpFromResponse(response);

  if (otp !== undefined && otp !== null && otp !== "") {
    console.log(label, otp);
    return otp;
  }

  console.log(`${label} no otp returned from API`, response);
  return undefined;
};
