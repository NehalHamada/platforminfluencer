import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  convertCampaignSchema,
  type ConvertCampaignSchema,
} from "@/schema/dashboard.schema";
import { dashboardService } from "@/services/dashboard.service";
import type { ConvertCampaignPopupProps } from "@/types/ui.types";
import { cn } from "@/lib/utils";

import { Button } from "../ui/Button";

function ConvertCampaignPopup({
  open,
  onClose,
  campaignName,
  onSubmitSuccess,
}: ConvertCampaignPopupProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const translateError = (errorKey?: string) => (errorKey ? t(errorKey) : null);

  const form = useForm<ConvertCampaignSchema>({
    resolver: zodResolver(convertCampaignSchema),
    defaultValues: {
      contentNotes: campaignName ?? "",
      finalPrice: "",
      deliverablesCount: "",
      deliveryDate: "",
      agreementTerms: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        contentNotes: campaignName ?? "",
        finalPrice: "",
        deliverablesCount: "",
        deliveryDate: "",
        agreementTerms: false,
      });
    }
  }, [campaignName, form, open]);

  const closePopup = () => {
    form.reset({
      contentNotes: campaignName ?? "",
      finalPrice: "",
      deliverablesCount: "",
      deliveryDate: "",
      agreementTerms: false,
    });
    onClose();
  };

  const onSubmit = async (data: ConvertCampaignSchema) => {
    try {
      await dashboardService.convertDealToCampaign(data);
      onSubmitSuccess?.(data);
      toast.success(t("camPopup.success"));
      closePopup();
    } catch (error) {
      console.error(error);
      toast.error(t("camPopup.error"));
    }
  };

  const fieldClass =
    "h-12 rounded-full border-[#d8d1bf] bg-white px-4 text-sm text-[#2b2b28] placeholder:text-[#9b958a] focus-visible:border-[#a7b58f] focus-visible:ring-[#a7b58f]/30";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closePopup()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-4xl overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_28px_90px_rgba(34,39,29,0.18)]">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="relative bg-[radial-gradient(circle_at_top_left,rgba(216,226,190,0.55),transparent_26%),radial-gradient(circle_at_top_right,rgba(252,245,201,0.6),transparent_24%),linear-gradient(180deg,#ffffff,#fcfbf7)] px-5 py-8 sm:px-8 sm:py-10">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={closePopup}
            className={cn(
              "absolute top-4 z-10 rounded-full bg-[#f5f2e8] text-[#55524a] hover:bg-[#ece7d8]",
              isRTL ? "left-4" : "right-4",
            )}>
            <X className="h-4 w-4" />
          </Button>

          <div className="mx-auto max-w-3xl">
            <DialogHeader className="mb-8 text-center">
              <DialogTitle className="text-xl font-semibold text-[#272722] sm:text-2xl">
                {t("camPopup.title")}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contentNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={isRTL ? "text-right" : "text-left"}>
                          {t("camPopup.fields.contentNotes")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t(
                              "camPopup.placeholders.contentNotes",
                            )}
                            className={cn(
                              fieldClass,
                              isRTL ? "text-right" : "text-left",
                            )}
                          />
                        </FormControl>
                        <FormMessage
                          className={isRTL ? "text-right" : "text-left"}>
                          {translateError(
                            form.formState.errors.contentNotes?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="finalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={isRTL ? "text-right" : "text-left"}>
                          {t("camPopup.fields.finalPrice")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("camPopup.placeholders.finalPrice")}
                            className={cn(
                              fieldClass,
                              isRTL ? "text-right" : "text-left",
                            )}
                          />
                        </FormControl>
                        {form.formState.errors.finalPrice?.message ? (
                          <p
                            className={cn(
                              "text-sm font-medium text-destructive",
                              isRTL ? "text-right" : "text-left",
                            )}>
                            {translateError(
                              form.formState.errors.finalPrice.message,
                            )}
                          </p>
                        ) : null}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliverablesCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={isRTL ? "text-right" : "text-left"}>
                          {t("camPopup.fields.deliverablesCount")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t(
                              "camPopup.placeholders.deliverablesCount",
                            )}
                            className={cn(
                              fieldClass,
                              isRTL ? "text-right" : "text-left",
                            )}
                          />
                        </FormControl>
                        <FormMessage
                          className={isRTL ? "text-right" : "text-left"}>
                          {translateError(
                            form.formState.errors.deliverablesCount?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={isRTL ? "text-right" : "text-left"}>
                          {t("camPopup.fields.deliveryDate")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t(
                              "camPopup.placeholders.deliveryDate",
                            )}
                            className={cn(
                              fieldClass,
                              isRTL ? "text-right" : "text-left",
                            )}
                          />
                        </FormControl>
                        <FormMessage
                          className={isRTL ? "text-right" : "text-left"}>
                          {translateError(
                            form.formState.errors.deliveryDate?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="agreementTerms"
                  render={({ field }) => (
                    <FormItem className="space-y-3 rounded-[18px] border border-[#d8d1bf] bg-white px-4 py-4">
                      <div
                        className={cn(
                          "flex items-start gap-3",
                          isRTL ? "flex-row-reverse text-right" : "text-left",
                        )}>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(!!checked)
                            }
                            className="mt-1 border-[#bfc7ab] data-[state=checked]:border-[#98a67e] data-[state=checked]:bg-[#98a67e]"
                          />
                        </FormControl>

                        <div className="space-y-1">
                          <FormLabel className="cursor-pointer text-sm font-medium text-[#2b2b28]">
                            {t("camPopup.fields.agreementTerms")}
                          </FormLabel>

                          <p className="text-sm leading-6 text-[#6b675f]">
                            {t("camPopup.defaultTerms")}
                          </p>
                        </div>
                      </div>

                      <FormMessage
                        className={isRTL ? "text-right" : "text-left"}>
                        {translateError(
                          form.formState.errors.agreementTerms?.message,
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div
                  className={cn(
                    "flex pt-2",
                    isRTL ? "justify-end" : "justify-start",
                  )}>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="relative h-12 min-w-52 rounded-full bg-[#98a67e] px-7 text-sm font-medium text-white shadow-[0_10px_24px_rgba(152,166,126,0.3)] hover:bg-[#8f9d74]">
                    <span
                      className={cn(
                        "absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#c7cfb5] bg-white text-[#7e8969]",
                        isRTL ? "left-2" : "right-2",
                      )}>
                      {isRTL ? (
                        <ArrowLeft className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </span>

                    <span className={isRTL ? "pl-8" : "pr-8"}>
                      {form.formState.isSubmitting
                        ? t("camPopup.submitting")
                        : t("camPopup.submit")}
                    </span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConvertCampaignPopup;
