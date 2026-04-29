import { Button } from "@/components/ui/Button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { offerSchema, type OfferSchema } from "@/schema/offer.schema";
import { offerService } from "@/services/offer.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";

function Offers() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const form = useForm<OfferSchema>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      proposedPrice: "",
      companyNote: "",
      executionTime: "",
      guarantee: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const fields: Array<{
    id: keyof OfferSchema;
    label: string;
    placeholder: string;
  }> = [
    {
      id: "proposedPrice",
      label: t("offer.proposedPrice"),
      placeholder: t("offer.proposedPricePlaceholder"),
    },
    {
      id: "companyNote",
      label: t("offer.companyNote"),
      placeholder: t("offer.companyNotePlaceholder"),
    },
    {
      id: "executionTime",
      label: t("offer.executionTime"),
      placeholder: t("offer.executionTimePlaceholder"),
    },
    {
      id: "guarantee",
      label: t("offer.guarantee"),
      placeholder: t("offer.guaranteePlaceholder"),
    },
  ];

  const onSubmit = async (data: OfferSchema) => {
    try {
      const response = await offerService.createOffer(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-7 rounded-none bg-white px-3 text-[9px] text-[#474741] shadow-none placeholder:text-[#adaba4] sm:h-12 sm:rounded-full sm:px-5 sm:text-sm",
      hasError ? "border-red-400" : "border-[#d9d6cc]",
      "focus-visible:border-[#aab48f] focus-visible:ring-1 focus-visible:ring-[#aab48f]/20 sm:focus-visible:ring-2",
      isRTL ? "text-right" : "text-left",
    );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[rgba(255,255,255,1)]">
      <div className="relative h-66 w-full overflow-hidden sm:h-100">
        <img
          src={hero}
          alt={t("offer.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 -mt-1 rounded-t-[10px] bg-[rgba(255,255,255,1)] px-2 pb-20 pt-4 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="border-0  py-0 shadow-none sm:rounded-[28px] sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardHeader className="items-center px-4 pt-4 text-center sm:px-8 sm:pt-8">
              <div className="space-y-2 text-center sm:space-y-3">
                <CardTitle className="text-[11px] font-semibold text-[#20201d] sm:text-3xl">
                  {t("offer.title")}
                </CardTitle>
                <CardDescription className="mx-auto max-w-44 text-[8px] leading-4 text-[#76746d] sm:max-w-none sm:text-base sm:leading-7">
                  {t("offer.description")}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-3 pb-5 sm:px-8 sm:pb-8">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mx-auto max-w-4xl space-y-4 sm:space-y-8">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 md:grid-cols-2 md:gap-y-6">
                    {fields.map((field) => (
                      <Field
                        key={field.id}
                        data-invalid={!!errors[field.id]}
                        className={cn(
                          "gap-2",
                          isRTL ? "items-end" : "items-start",
                        )}>
                        <FieldLabel
                          htmlFor={field.id}
                          className={cn(
                            "text-[9px] font-medium text-[#3b3b36] sm:text-sm",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {field.label}
                        </FieldLabel>

                        <FieldContent>
                          <Input
                            id={field.id}
                            {...register(field.id)}
                            placeholder={field.placeholder}
                            aria-invalid={Boolean(errors[field.id])}
                            className={inputClass(!!errors[field.id])}
                          />

                          <FieldError
                            className={cn(
                              "text-[8px] font-medium sm:text-xs",
                              isRTL ? "text-right" : "text-left",
                            )}>
                            {errors[field.id]?.message
                              ? t(errors[field.id]?.message ?? "")
                              : null}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    ))}
                  </div>

                  <div
                    className={cn(
                      "flex",
                      isRTL ? "justify-start" : "justify-end",
                      "sm:justify-start",
                    )}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="brand"
                      className={cn(
                        "h-6 rounded-full px-2.5 text-[9px] font-medium shadow-none disabled:cursor-not-allowed sm:h-13 sm:px-6 sm:text-sm sm:shadow-[0_10px_30px_rgba(170,180,143,0.3)]",
                        isRTL ? "flex-row-reverse" : "flex-row-reverse",
                      )}>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#eef2e6] text-[#7f8d69] sm:h-8 sm:w-8">
                        {isRTL ? (
                          <ArrowLeft className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                        ) : (
                          <ArrowRight className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                        )}
                      </span>
                      <span>{t("offer.submit")}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offers;
