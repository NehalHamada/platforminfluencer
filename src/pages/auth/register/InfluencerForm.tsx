import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  influencerSchema,
  type InfluencerSchemaType,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { useContentTypesQuery } from "@/queries/masterData/useContentTypesQuery";
import { useFollowerRangesQuery } from "@/queries/masterData/useFollowerRangesQuery";
import { usePlatformsQuery } from "@/queries/masterData/usePlatformsQuery";
import logphoto from "/assets/login-register.png";

function InfluencerForm() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language === "ar";
  const platformsQuery = usePlatformsQuery();
  const followerRangesQuery = useFollowerRangesQuery();
  const contentTypesQuery = useContentTypesQuery();
  const savedRegisterData = sessionStorage.getItem("registerData");

  useEffect(() => {
    if (!savedRegisterData) {
      navigate("/register");
    }
  }, [savedRegisterData, navigate]);

  const form = useForm<InfluencerSchemaType>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      platform_ids: [],
      follower_range_id: "",
      content_type_id: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: InfluencerSchemaType) => {
    if (!savedRegisterData) return;

    try {
      const influencerStepOnePayload = {
        platform_ids: data.platform_ids.map(Number),
        follower_range_ids: [Number(data.follower_range_id)],
        content_type_ids: [Number(data.content_type_id)],
      };

      sessionStorage.setItem(
        "influencerStepOneData",
        JSON.stringify(influencerStepOnePayload),
      );

      navigate("/register/influencer/complete");
    } catch {
      toast.error(t("auth_errors.register_failed"));
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
      hasError
        ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
        : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
    );

  const getPlatformLabel = (id: string) => {
    const platform = platformsQuery.data?.find(
      (item) => item.id.toString() === id,
    );

    return t(`masterData.platforms.${id}`, platform?.label ?? id);
  };

  if (location.pathname !== "/register/influencer") {
    return <Outlet />;
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(
        "fixed inset-0 z-60 flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 text-white lg:relative lg:inset-auto lg:z-auto lg:flex-col-reverse lg:justify-between lg:gap-6 lg:p-4 lg:text-inherit",
        "lg:flex-row",
        isArabic ? "lg:flex-row-reverse" : "lg:flex-row-reverse",
      )}>
      <img
        src={logphoto}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover lg:hidden"
      />
      <div className="absolute inset-0 bg-black/70 lg:hidden" />

      <div className="relative z-10 flex w-full justify-center lg:w-1/2">
        <Card className="w-full max-w-md border-0 bg-transparent py-0 shadow-none ring-0">
          <CardContent className="p-0">
            <h1 className="mb-8 text-center text-2xl font-bold text-white lg:mb-10 lg:text-[#202020]">
              {t("influencer.title")}
            </h1>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="platform_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          "mb-2 block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("influencer.platform")}
                      </FormLabel>
                      <FormControl>
                        <DropdownMenu dir={isArabic ? "rtl" : "ltr"}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              disabled={platformsQuery.isLoading}
                              aria-invalid={
                                errors.platform_ids ? "true" : undefined
                              }
                              className={cn(
                                inputClass(!!errors.platform_ids),
                                "flex w-full items-center justify-between px-3",
                                isArabic ? "text-right" : "text-left",
                              )}>
                              <span className="truncate">
                                {platformsQuery.isLoading
                                  ? t("influencer.loadingPlatforms")
                                  : field.value.length
                                    ? field.value
                                        .map(getPlatformLabel)
                                        .join(", ")
                                    : t("influencer.platformPlaceholder")}
                              </span>
                              <ChevronDown
                                size={16}
                                className="shrink-0 text-white/75 lg:text-gray-400"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align={isArabic ? "end" : "start"}
                            className="z-9999 w-(--radix-dropdown-menu-trigger-width)">
                            {platformsQuery.data?.map((platform) => {
                              const value = platform.id.toString();
                              const selected =
                                field.value.indexOf(value) !== -1;

                              return (
                                <DropdownMenuCheckboxItem
                                  key={platform.id}
                                  checked={selected}
                                  onSelect={(event) => {
                                    event.preventDefault();
                                  }}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, value]);
                                      return;
                                    }

                                    field.onChange(
                                      field.value.filter((id) => id !== value),
                                    );
                                  }}>
                                  {getPlatformLabel(value)}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      {platformsQuery.isError ? (
                        <p
                          className={cn(
                            "text-sm font-medium text-destructive",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t("influencer.platformsError")}
                        </p>
                      ) : null}
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.platform_ids?.message
                          ? t(errors.platform_ids.message)
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="follower_range_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          "mb-2 block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("influencer.followersRange")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={followerRangesQuery.isLoading}>
                          <SelectTrigger
                            dir={isArabic ? "rtl" : "ltr"}
                            className={cn(
                              inputClass(!!errors.follower_range_id),
                              "[&>svg]:text-white/75 lg:[&>svg]:text-gray-400",
                              isArabic ? "text-right" : "text-left",
                            )}
                            aria-invalid={!!errors.follower_range_id}>
                            <SelectValue
                              placeholder={
                                followerRangesQuery.isLoading
                                  ? t("influencer.loadingFollowerRanges")
                                  : t("influencer.followersPlaceholder")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent
                            dir={isArabic ? "rtl" : "ltr"}
                            position="popper"
                            sideOffset={6}
                            className="z-9999">
                            {followerRangesQuery.data?.map((range) => (
                              <SelectItem
                                key={range.id}
                                value={range.id.toString()}>
                                {t(
                                  `masterData.followerRanges.${range.id}`,
                                  range.label,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {followerRangesQuery.isError ? (
                        <p
                          className={cn(
                            "text-sm font-medium text-destructive",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t("influencer.followerRangesError")}
                        </p>
                      ) : null}
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.follower_range_id?.message
                          ? t(errors.follower_range_id.message)
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          "mb-2 block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("influencer.contentType")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={contentTypesQuery.isLoading}>
                          <SelectTrigger
                            dir={isArabic ? "rtl" : "ltr"}
                            className={cn(
                              inputClass(!!errors.content_type_id),
                              "[&>svg]:text-white/75 lg:[&>svg]:text-gray-400",
                              isArabic ? "text-right" : "text-left",
                            )}
                            aria-invalid={!!errors.content_type_id}>
                            <SelectValue
                              placeholder={
                                contentTypesQuery.isLoading
                                  ? t("influencer.loadingContentTypes")
                                  : t("influencer.contentTypePlaceholder")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent
                            dir={isArabic ? "rtl" : "ltr"}
                            position="popper"
                            sideOffset={6}
                            className="z-9999">
                            {contentTypesQuery.data?.map((contentType) => (
                              <SelectItem
                                key={contentType.id}
                                value={contentType.id.toString()}>
                                {t(
                                  `masterData.contentTypes.${contentType.id}`,
                                  contentType.label,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {contentTypesQuery.isError ? (
                        <p
                          className={cn(
                            "text-sm font-medium text-destructive",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t("influencer.contentTypesError")}
                        </p>
                      ) : null}
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.content_type_id?.message
                          ? t(errors.content_type_id.message)
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="brand"
                  className="relative h-10 w-full rounded-full text-sm lg:h-11">
                  <span
                    className={cn(
                      "pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#93a079]",
                      isArabic ? "left-2" : "right-2",
                    )}>
                    {isArabic ? (
                      <ChevronLeft size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                  {isSubmitting
                    ? t("influencer.loading")
                    : t("influencer.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-full lg:block lg:w-1/2">
        <img
          src={logphoto}
          alt="influencer"
          className="h-50 w-full rounded-[20px] object-cover lg:h-130"
          width={300}
        />
      </div>
    </section>
  );
}

export default InfluencerForm;
