import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";
import LazyMapFrame from "@/components/common/contact/LazyMapFrame";
import { useSendContactMessageMutation } from "@/queries/contact/useSendContactMessageMutation";
import { useForm } from "react-hook-form";
import type { ContactPayload, InfoCard } from "@/types/contact.types";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useContactInfoQuery } from "@/queries/contact/useContactInfoQuery";

function ContactUs() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { data: contactInfo } = useContactInfoQuery();

  const sendMessageMutation = useSendContactMessageMutation();
  console.log("Mutation", sendMessageMutation);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactPayload) => {
    sendMessageMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message || t("contsctForUs.form.success"));
        reset();
      },
      onError: () => {
        toast.error(t("contsctForUs.form.error"));
      },
    });
  };

  console.log("submit", onSubmit);

  const contactContent = contactInfo?.content;

  const phoneText =
    contactContent?.phones && contactContent.phones.length > 0
      ? contactContent.phones.join("-")
      : t("contsctForUs.info.phone.value");

  const infoCards: InfoCard[] = [
    {
      key: "email",
      icon: Mail,
      value: contactInfo?.content.email || t("contsctForUs.info.email.value"),
    },
    {
      key: "phone",
      icon: Phone,
      value: phoneText,
    },
    {
      key: "address",
      icon: MapPin,
      value:
        contactInfo?.content.address || t("contsctForUs.info.address.value"),
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 w-full max-w-full overflow-x-clip">
      {/* Hero */}
      <div className="relative h-60 w-full overflow-hidden sm:h-52 lg:h-72">
        <img
          src={hero}
          alt={t("contsctForUs.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
        {/* Kicker anchored to bottom of hero */}
        <div
          className={cn(
            "absolute bottom-10 z-10 px-5 sm:bottom-10 sm:px-8",
            isRTL ? "right-0 text-right" : "left-0 text-left",
          )}>
          <span className="inline-block text-sm font-medium text-white underline underline-offset-4 sm:text-base">
            {t("contsctForUs.kicker")}
          </span>
        </div>
      </div>

      {/* White content card */}
      <div className="relative z-10 -mt-6 rounded-t-[24px] bg-white sm:-mt-8 sm:rounded-t-[32px]">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-10 lg:pt-10">
          {/* Map */}
          <div className="overflow-hidden rounded-[18px]">
            <LazyMapFrame title={t("contsctForUs.mapAlt")} />
          </div>

          {/* Form + Info */}
          <div className="mt-8 grid grid-cols-1 gap-9 sm:mt-10 lg:grid-cols-2 lg:items-start lg:gap-14">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  className={cn(
                    "block text-sm text-[#55544e]",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("contsctForUs.form.name")}
                </Label>
                <Input
                  {...register("name", { required: true })}
                  className={cn(
                    "h-11 rounded-full border-[#ddd8cb] bg-white px-5 shadow-none",
                    isRTL ? "text-right" : "text-left",
                  )}
                />
                {errors.name ? (
                  <p className="text-xs text-red-500">
                    {t("contsctForUs.form.required")}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  className={cn(
                    "block text-sm text-[#55544e]",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("contsctForUs.form.email")}
                </Label>
                <Input
                  {...register("email", { required: true })}
                  className={cn(
                    "h-11 rounded-full border-[#ddd8cb] bg-white px-5 shadow-none",
                    isRTL ? "text-right" : "text-left",
                  )}
                />
                {errors.email ? (
                  <p className="text-xs text-red-500">
                    {t("contsctForUs.form.required")}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  className={cn(
                    "block text-sm text-[#55544e]",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("contsctForUs.form.phone")}
                </Label>
                <Input
                  {...register("phone", { required: true })}
                  className={cn(
                    "h-11 rounded-full border-[#ddd8cb] bg-white px-5 shadow-none",
                    isRTL ? "text-right" : "text-left",
                  )}
                />
                {errors.phone ? (
                  <p className="text-xs text-red-500">
                    {t("contsctForUs.form.required")}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  className={cn(
                    "block text-sm text-[#55544e]",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("contsctForUs.form.message")}
                </Label>
                <Textarea
                  {...register("message", { required: true })}
                  className={cn(
                    "min-h-28 rounded-[16px] border-[#ddd8cb] bg-white px-5 py-4 shadow-none",
                    isRTL ? "text-right" : "text-left",
                  )}
                />
                {errors.message ? (
                  <p className="text-xs text-red-500">
                    {t("contsctForUs.form.required")}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  variant="brand"
                  className={cn(
                    "h-11 min-w-32 gap-2 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-6 text-sm font-medium text-white hover:opacity-90",
                    isRTL ? "flex-row" : "flex-row",
                  )}>
                  <span>
                    {sendMessageMutation.isPending
                      ? t("contsctForUs.form.sending")
                      : t("contsctForUs.form.submit")}
                  </span>
                  {isRTL ? (
                    <ArrowLeft size={16} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={16} aria-hidden="true" />
                  )}
                </Button>
              </div>
            </form>

            {/* Contact info */}
            <div
              className={cn("space-y-5", isRTL ? "text-right" : "text-left")}>
              <h2 className="text-xl font-semibold leading-snug text-[#232320] sm:text-2xl">
                {contactInfo?.description || t("contsctForUs.description")}
              </h2>

              <div className="space-y-4 pt-1">
                {infoCards.map(({ key, icon: Icon, value }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 text-[#4c4b44]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd8cb] bg-[rgba(111,66,193,0.08)] text-[rgba(111,66,193,0.7)]">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-6 sm:text-[15px]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
