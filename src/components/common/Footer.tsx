import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
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

  const form = useForm<FooterSchemaType>({
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
      <Card className="w-full rounded-none rounded-t-[24px] border-0 bg-transparent py-0 shadow-none ring-0">
        <CardContent className="rounded-t-[24px] bg-linear-to-r from-black/70 to-black/30 p-8 text-center text-white backdrop-blur-md">
          <img src={logo} alt="Logo" className="mx-auto mb-4 h-auto" />

          <p className="mb-6 text-sm leading-6 text-white/90">
            {t("footer.description")}
          </p>

          <Form {...form}>
            <form
              className="mx-auto max-w-xl"
              onSubmit={form.handleSubmit(onSubmit)}
              aria-label={t("footer.emailPlaceholder")}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-center gap-3",
                        isRTL ? "sm:flex-row" : "sm:flex-row-reverse",
                      )}>
                      <label htmlFor="footer-email" className="sr-only">
                        {t("footer.emailPlaceholder")}
                      </label>

                      <FormControl>
                        <Input
                          {...field}
                          id="footer-email"
                          type="email"
                          placeholder={t("footer.emailPlaceholder")}
                          className={cn(
                            "h-11 w-full max-w-md rounded-full border-white/40 bg-transparent px-6 text-sm text-white placeholder:text-white/70 focus-visible:border-white/60 focus-visible:ring-white/20",
                            isRTL ? "text-right" : "text-left",
                          )}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        variant="default"
                        size="icon-lg"
                        aria-label={t("footer.emailPlaceholder")}
                        className="rounded-full bg-[#AFC19E] text-white hover:bg-[#a2b590]">
                        {i18n.language === "en" ? (
                          <ArrowBigRight />
                        ) : (
                          <ArrowBigLeft />
                        )}
                      </Button>
                    </div>

                    <FormMessage className="mt-2 text-center text-sm text-[#ffd7d7]">
                      {form.formState.errors.email?.message
                        ? t(form.formState.errors.email.message)
                        : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </footer>
  );
}

export default Footer;
