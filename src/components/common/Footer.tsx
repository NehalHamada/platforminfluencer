import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm as useReactHookForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import logo from "/assets/logo.svg";
import { footerSchema, type FooterSchemaType } from "@/schema/essential.schema";

function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const form = useReactHookForm<FooterSchemaType>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof footerSchema>) => {
    console.log("Footer email submitted:", values.email);
    form.reset();
  };

  return (
    <footer className="bg-[#F9F9F9]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full rounded-t-[30px] bg-[rgba(30,30,30,1)] px-4 py-12 font-ibm-plex md:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Growth Logo"
            className="mb-6 h-12 w-auto object-contain md:h-14"
          />

          {/* Description */}
          <p className="mx-auto mb-10 max-w-[480px] text-[15px] leading-8 text-[#e8e8e8] md:text-[17px]">
            {t("completeCompanyProfile.footerText")}
          </p>

          {/* Form */}
          <Form {...form}>
            <form
              className="w-full max-w-[500px]"
              onSubmit={form.handleSubmit(onSubmit)}
              aria-label={t("registrationSuccess.emailPlaceholder")}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex w-full flex-row items-center justify-center gap-3 md:gap-4">
                      <FormControl>
                        <Input
                          {...field}
                          id="footer-email"
                          type="email"
                          placeholder={t(
                            "registrationSuccess.emailPlaceholder",
                          )}
                          className="h-[48px] w-full flex-1 rounded-full border border-[#888] bg-transparent px-4 text-start text-[13px] text-white placeholder-[#b0b0b0] shadow-sm outline-none transition-all focus-visible:border-[#aaa] focus-visible:ring-0 md:w-[320px] md:px-6 md:text-center md:text-[15px]"
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        variant="default"
                        aria-label={t("registrationSuccess.emailPlaceholder")}
                        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#a7b78e] px-0 text-white transition-colors hover:bg-[#96a57e] md:w-[110px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isRTL ? "-scale-x-100" : ""}>
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </Button>
                    </div>

                    <FormMessage className="mt-3 text-center text-sm text-[#ffb4b4]">
                      {form.formState.errors.email?.message
                        ? t(form.formState.errors.email.message)
                        : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
