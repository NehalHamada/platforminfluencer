import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  influencerChatSchema,
  type InfluencerChatSchema,
} from "@/schema/dashboard.schema";
import { dashboardService } from "@/services/dashboard.service";
import hero from "/assets/Hero.png";

type SelectFieldProps = {
  id: keyof InfluencerChatSchema;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isRTL: boolean;
};

function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  isRTL,
}: SelectFieldProps) {
  return (
    <Field
      data-invalid={!!error}
      className={cn("gap-2", isRTL ? "items-end" : "items-start")}>
      <FieldLabel
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-[#3b3b36]",
          isRTL ? "text-right" : "text-left",
        )}>
        {label}
      </FieldLabel>

      <FieldContent>
        <Select dir={isRTL ? "rtl" : "ltr"} value={value} onValueChange={onChange}>
          <SelectTrigger
            id={id}
            aria-invalid={!!error}
            className={cn(
              "h-12 w-full rounded-full border bg-white px-5 text-sm text-[#474741] shadow-none",
              error ? "border-red-400" : "border-[#d9d6cc]",
              "focus-visible:border-[#aab48f] focus-visible:ring-[#aab48f]/20",
              isRTL ? "text-right" : "text-left",
            )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className="rounded-2xl border-[#d9d6cc] bg-white">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FieldError
          className={cn("text-xs font-medium", isRTL ? "text-right" : "text-left")}>
          {error}
        </FieldError>
      </FieldContent>
    </Field>
  );
}

function ContactInfluencer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const form = useForm<InfluencerChatSchema>({
    resolver: zodResolver(influencerChatSchema),
    defaultValues: {
      campaignName: "",
      contentType: "",
      goal: "",
      budget: "",
      executionDate: "",
      message: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const contentTypes = [
    t("infChat.contentTypes.skincare"),
    t("infChat.contentTypes.fashion"),
    t("infChat.contentTypes.lifestyle"),
  ];

  const goals = [
    t("infChat.goals.awareness"),
    t("infChat.goals.sales"),
    t("infChat.goals.launch"),
  ];

  const executionDates = [
    t("infChat.executionDates.thisWeek"),
    t("infChat.executionDates.nextWeek"),
    t("infChat.executionDates.thisMonth"),
  ];

  const onSubmit = async (data: InfluencerChatSchema) => {
    try {
      const response = await dashboardService.createInfluencerChat(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getError = (message?: string) => (message ? t(message) : undefined);

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-12 rounded-full bg-white px-5 text-sm text-[#474741] shadow-none placeholder:text-[#adaba4]",
      hasError ? "border-red-400" : "border-[#d9d6cc]",
      "focus-visible:border-[#aab48f] focus-visible:ring-2 focus-visible:ring-[#aab48f]/20",
      isRTL ? "text-right" : "text-left",
    );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[#f3f3ef]">
      <div className="relative h-85 w-full overflow-hidden sm:h-95 lg:h-105">
        <img
          src={hero}
          alt={t("infChat.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 -mt-8 rounded-t-[34px] bg-[#f7f6f2] px-3 pb-8 pt-6 sm:-mt-10 sm:px-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-[28px] border-0 bg-white py-0 shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardHeader className="items-center px-5 pt-6 text-center sm:px-8 sm:pt-8">
              <div className="max-w-2xl space-y-3">
                <h1 className="text-xl font-semibold text-[#20201d] sm:text-3xl">
                  {t("infChat.title")}{" "}
                  <span className="font-bold text-[#2f2f2a]">
                    {t("infChat.influencerName")}
                  </span>
                </h1>

                <p className="text-sm leading-7 text-[#76746d] sm:text-base">
                  {t("infChat.description")}
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mx-auto max-w-4xl space-y-8">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                    <Field
                      data-invalid={!!errors.campaignName}
                      className={cn("gap-2", isRTL ? "items-end" : "items-start")}>
                      <FieldLabel
                        htmlFor="campaignName"
                        className={cn(
                          "text-sm font-medium text-[#3b3b36]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("infChat.campaignName")}
                      </FieldLabel>

                      <FieldContent>
                        <Input
                          id="campaignName"
                          {...register("campaignName")}
                          placeholder={t("infChat.placeholders.campaignName")}
                          aria-invalid={!!errors.campaignName}
                          className={inputClass(!!errors.campaignName)}
                        />

                        <FieldError
                          className={cn(
                            "text-xs font-medium",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {getError(errors.campaignName?.message)}
                        </FieldError>
                      </FieldContent>
                    </Field>

                    <Controller
                      name="contentType"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          id="contentType"
                          label={t("infChat.contentType")}
                          placeholder={t("infChat.placeholders.contentType")}
                          options={contentTypes}
                          value={field.value}
                          onChange={field.onChange}
                          error={getError(errors.contentType?.message)}
                          isRTL={isRTL}
                        />
                      )}
                    />

                    <Controller
                      name="goal"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          id="goal"
                          label={t("infChat.goal")}
                          placeholder={t("infChat.placeholders.goal")}
                          options={goals}
                          value={field.value}
                          onChange={field.onChange}
                          error={getError(errors.goal?.message)}
                          isRTL={isRTL}
                        />
                      )}
                    />

                    <Field
                      data-invalid={!!errors.budget}
                      className={cn("gap-2", isRTL ? "items-end" : "items-start")}>
                      <FieldLabel
                        htmlFor="budget"
                        className={cn(
                          "text-sm font-medium text-[#3b3b36]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("infChat.budget")}
                      </FieldLabel>

                      <FieldContent>
                        <Input
                          id="budget"
                          {...register("budget")}
                          placeholder={t("infChat.placeholders.budget")}
                          aria-invalid={!!errors.budget}
                          className={inputClass(!!errors.budget)}
                        />

                        <FieldError
                          className={cn(
                            "text-xs font-medium",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {getError(errors.budget?.message)}
                        </FieldError>
                      </FieldContent>
                    </Field>

                    <Controller
                      name="executionDate"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          id="executionDate"
                          label={t("infChat.executionDate")}
                          placeholder={t("infChat.placeholders.executionDate")}
                          options={executionDates}
                          value={field.value}
                          onChange={field.onChange}
                          error={getError(errors.executionDate?.message)}
                          isRTL={isRTL}
                        />
                      )}
                    />

                    <Field
                      data-invalid={!!errors.message}
                      className={cn(
                        "gap-2 md:col-span-2",
                        isRTL ? "items-end" : "items-start",
                      )}>
                      <FieldLabel
                        htmlFor="message"
                        className={cn(
                          "text-sm font-medium text-[#3b3b36]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("infChat.message")}
                      </FieldLabel>

                      <FieldContent>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder={t("infChat.placeholders.message")}
                          aria-invalid={!!errors.message}
                          className={cn(
                            "min-h-32 rounded-[24px] border bg-white px-5 py-4 text-sm text-[#474741] shadow-none placeholder:text-[#adaba4]",
                            errors.message ? "border-red-400" : "border-[#d9d6cc]",
                            "focus-visible:border-[#aab48f] focus-visible:ring-2 focus-visible:ring-[#aab48f]/20",
                            isRTL ? "text-right" : "text-left",
                          )}
                        />

                        <FieldError
                          className={cn(
                            "text-xs font-medium",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {getError(errors.message?.message)}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  </div>

                  <div className="flex justify-center md:justify-start">
                    <Button
                      type="submit"
                      variant="brand"
                      disabled={isSubmitting}
                      className={cn(
                        "h-13 rounded-full px-6 text-sm font-medium shadow-[0_10px_30px_rgba(170,180,143,0.3)] disabled:cursor-not-allowed",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2e6] text-[#7f8d69]">
                        {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                      </span>
                      <span>{t("infChat.submit")}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ContactInfluencer;
