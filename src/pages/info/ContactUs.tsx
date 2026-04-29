import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
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
      className="relative -mt-24 w-full max-w-full overflow-x-clip bg-[#efefec]">
      <div className="relative h-64 w-full overflow-hidden sm:h-56 lg:h-80">
        <img
          src={hero}
          alt={t("contsctForUs.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
      </div>

      <div className="absolute inset-x-0 top-52 z-20 px-4 sm:top-34 sm:px-6 lg:top-65">
        <div className="mx-auto max-w-7xl">
          <div className={cn(isRTL ? "text-right" : "text-left")}>
            <span className="inline-block text-sm font-medium text-white underline underline-offset-4 sm:text-base">
              {t("contsctForUs.kicker")}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-4 w-full max-w-full sm:-mt-6 sm:px-4">
        <div className="mx-auto w-full max-w-7xl overflow-x-hidden">
          <Card className="w-full max-w-full overflow-hidden rounded-t-[24px] rounded-b-none border-0 bg-white py-0 shadow-[0_12px_40px_rgba(32,34,28,0.05)] sm:rounded-t-[28px]">
            <CardContent className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
              <div className="w-full max-w-full">
                <div className="w-full max-w-full overflow-hidden rounded-[22px] border border-[#f0ece2] bg-[#f6f5f1]">
                  <LazyMapFrame title={t("contsctForUs.mapAlt")} />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.08fr] lg:items-start lg:gap-12">
                  <div
                    className={cn(
                      "space-y-6",
                      isRTL ? "text-right" : "text-left",
                    )}>
                    <div>
                      <h1 className="text-2xl font-semibold leading-tight text-[#232320] sm:text-[2rem]">
                        {contactInfo?.title || t("contsctForUs.title")}
                      </h1>
                      <p className="mt-3 max-w-md text-sm leading-8 text-[#5d5b53] sm:text-[15px]">
                        {contactInfo?.description ||
                          t("contsctForUs.description")}
                      </p>
                    </div>

                    <div className="space-y-5">
                      {infoCards.map(({ key, icon: Icon, value }) => (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center gap-3 text-[#4c4b44]",
                            isRTL ? "flex-row justify-start" : "justify-start",
                          )}>
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd8cb] bg-[#f9f8f4] text-[#8d9c6f]">
                            <Icon size={15} aria-hidden="true" />
                          </span>
                          <span className="text-sm leading-7 sm:text-[15px]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

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

                    <div
                      className={cn(
                        "flex",
                        isRTL ? "justify-start" : "justify-end",
                      )}>
                      <Button
                        type="submit"
                        disabled={sendMessageMutation.isPending}
                        variant="brand"
                        className={cn(
                          "h-11 min-w-32 rounded-md bg-[#9cab80] px-6 text-sm font-medium text-white hover:bg-[#92a273]",
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
