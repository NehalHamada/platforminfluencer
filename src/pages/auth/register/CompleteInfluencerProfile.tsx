import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  completeInfluencerSchema,
  type CompleteInfluencerSchemaType,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import hero from "/assets/Hero.png";
import { usePlatformsQuery } from "@/queries/masterData/usePlatformsQuery";
import type { SharedRegisterData } from "@/types/auth.types";

function CompleteInfluencerProfile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const platformsQuery = usePlatformsQuery();

  const savedRegisterData = sessionStorage.getItem("registerData");

  useEffect(() => {
    if (!savedRegisterData) {
      navigate("/register");
    }
  }, [savedRegisterData, navigate]);

  const parsedRegisterData = useMemo<SharedRegisterData | null>(() => {
    if (!savedRegisterData) return null;

    try {
      return JSON.parse(savedRegisterData) as SharedRegisterData;
    } catch {
      return null;
    }
  }, [savedRegisterData]);

  const form = useForm<CompleteInfluencerSchemaType>({
    resolver: zodResolver(completeInfluencerSchema),
    defaultValues: {
      phone: "",
      cooperationType: "",
      contentField: "",
      platformAccounts: [{ platform_id: "", accountLink: "" }],
      acceptedTerms: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "platformAccounts",
  });

  const onSubmit = async (data: CompleteInfluencerSchemaType) => {
    if (!parsedRegisterData) {
      toast.error(t("influencer.error"));
      navigate("/register");
      return;
    }

    try {
      const payload = {
        phone: data.phone,
        cooperation_type: data.cooperationType,
        content_field: data.contentField,
        platform_ids: data.platformAccounts.map((item) =>
          Number(item.platform_id),
        ),
        platform_links: data.platformAccounts.map((item) => item.accountLink),
        accepted_terms: data.acceptedTerms,
      };

      sessionStorage.setItem("influencerStepTwoData", JSON.stringify(payload));

      navigate("/register/influencer/payment");
    } catch {
      toast.error(t("influencer.error"));
    }
  };

  const fieldClass =
    "h-8 w-full rounded-full border border-[#d2d2cc] bg-transparent px-4 text-[11px] shadow-none focus-visible:ring-0";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#ececea]">
      <div className="bg-[#ececea]">
        <div className="relative h-50 overflow-hidden">
          <img
            src={hero}
            alt="campaign hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative -mt-4 rounded-t-[26px] bg-[#f6f6f3] px-8 pb-10 pt-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mx-auto text-center">
            <h1 className="text-[17px] font-semibold leading-8 text-[#1f1f1f]">
              {t("completeInfluencerProfile.title")}
            </h1>
            <p className="mt-2 text-[11px] leading-6 text-[#666666]">
              {t("completeInfluencerProfile.description")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              <Card className="border-0 bg-transparent py-0 shadow-none ring-0">
                <CardContent className="space-y-5 p-0">
                  <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                    <div>
                      <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                        {t("completeInfluencerProfile.fullName")}
                      </FormLabel>
                      <Input
                        value={parsedRegisterData?.name ?? ""}
                        readOnly
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                        {t("completeInfluencerProfile.email")}
                      </FormLabel>
                      <Input
                        type="email"
                        value={parsedRegisterData?.email ?? ""}
                        readOnly
                        className={fieldClass}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                            {t("completeInfluencerProfile.phone")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              className={fieldClass}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contentField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                            {t("completeInfluencerProfile.contentField")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              className={fieldClass}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                        {t("completeInfluencerProfile.password")}
                      </FormLabel>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        value={parsedRegisterData?.password ?? ""}
                        readOnly
                        className={fieldClass}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="cooperationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                            {t("completeInfluencerProfile.cooperationType")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              className={fieldClass}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-x-3 gap-y-4 sm:col-span-2 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`platformAccounts.${index}.platform_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerProfile.platform")}
                              </FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  value={field.value ?? ""}
                                  disabled={platformsQuery.isLoading}
                                  className={fieldClass}>
                                  <option value="">
                                    {platformsQuery.isLoading
                                      ? t(
                                          "completeInfluencerProfile.loadingPlatforms",
                                        )
                                      : t(
                                          "completeInfluencerProfile.selectPlatform",
                                        )}
                                  </option>
                                  {platformsQuery.data?.map((platform) => (
                                    <option
                                      key={platform.id}
                                      value={platform.id.toString()}>
                                      {t(
                                        `masterData.platforms.${platform.id}`,
                                        platform.label,
                                      )}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              {platformsQuery.isError ? (
                                <p className="text-[10px] font-medium text-destructive">
                                  {t(
                                    "completeInfluencerProfile.platformsError",
                                  )}
                                </p>
                              ) : null}
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`platformAccounts.${index}.accountLink`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="mb-1.5 flex items-center justify-between gap-2">
                                <FormLabel className="block text-[11px] font-medium text-[#3f3f3f]">
                                  {t("completeInfluencerProfile.accountLink")}
                                </FormLabel>
                                {fields.length > 1 ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => remove(index)}
                                    aria-label={t(
                                      "completeInfluencerProfile.removePlatform",
                                    )}
                                    className="h-5 w-5 rounded-full p-0 text-[#7d7d7d] hover:bg-[#ececea]">
                                    <X size={12} />
                                  </Button>
                                ) : null}
                              </div>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  className={fieldClass}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        append({ platform_id: "", accountLink: "" })
                      }
                      className="flex cursor-pointer h-auto items-center gap-1.5 p-0 text-[11px] text-[#6a6a6a] hover:bg-transparent">
                      <Plus size={12} className="text-[#7d7d7d]" />
                      <span className="text-[11px] font-normal text-[#6a6a6a]">
                        {t("completeInfluencerProfile.addAnotherPlatform")}
                      </span>
                    </Button>

                    <FormField
                      control={form.control}
                      name="acceptedTerms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#8b8b8b]">
                            <FormControl>
                              <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                                className="border-[#cfcfc9] data-[state=checked]:border-[#8ea179] data-[state=checked]:bg-[#8ea179]"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-[11px] font-normal text-[#8b8b8b]">
                              {t("completeInfluencerProfile.acceptTerms")}
                            </FormLabel>
                          </div>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-7 flex justify-start">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-8.75 cursor-pointer min-w-32 rounded-full bg-[#9ba785] px-3 text-[11px] font-medium text-white hover:bg-[#8f9b79] disabled:opacity-70">
                      <span className="flex w-full items-center justify-between gap-2">
                        <span>
                          {isSubmitting
                            ? t("completeInfluencerProfile.loading")
                            : t("completeInfluencerProfile.continue")}
                        </span>
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#5a6947]",
                            isArabic ? "order-1" : "order-2",
                          )}>
                          {isArabic ? (
                            <ChevronLeft size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </span>
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default CompleteInfluencerProfile;
