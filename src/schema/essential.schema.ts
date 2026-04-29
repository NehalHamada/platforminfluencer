import z from "zod";

export const footerSchema = z.object({
  email: z.email("errors.invalid_email").min(1, "errors.email_required"),
});

export type FooterSchemaType = z.infer<typeof footerSchema>;
