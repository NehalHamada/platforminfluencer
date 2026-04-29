import { useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ConvertCampaignFormData } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";
import hero from "/assets/Hero.png";

import ConvertCampaignPopup from "../common/ConvertCampaignPopup";
import { Button } from "../ui/Button";
import type { ChatConversation, ChatMessage } from "./ChatPage";
import MessageInput from "./MessageInput";

type MessageThreadProps = {
  conversation: ChatConversation;
  isRTL: boolean;
  onAgreementSubmit: (data: ConvertCampaignFormData) => void;
};

function AgreementBubble({
  message,
  isRTL,
  t,
}: {
  message: ChatMessage;
  isRTL: boolean;
  t: TFunction;
}) {
  if (!message.agreement) return null;

  const items = [
    {
      label: t("camPopup.fields.contentNotes"),
      value: message.agreement.contentNotes,
    },
    {
      label: t("camPopup.fields.finalPrice"),
      value: message.agreement.finalPrice,
    },
    {
      label: t("camPopup.fields.deliverablesCount"),
      value: message.agreement.deliverablesCount,
    },
    {
      label: t("camPopup.fields.deliveryDate"),
      value: message.agreement.deliveryDate,
    },
  ];

  return (
    <Card className="max-w-[82%] border-[#e5e2da] bg-[#f7f7f7] py-0 shadow-sm ring-0 sm:max-w-[52%]">
      <CardHeader
        className={cn("px-3 pb-0 pt-3", isRTL ? "text-right" : "text-left")}>
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}>
          <CardTitle className="text-xs font-medium text-[#636363]">
            {t("chat.thread.pendingAgreement", "Pending agreement")}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 rounded-md border-[#d8d2e8] bg-white px-3 text-xs text-[#6d6591] hover:bg-[#f4f1fb]">
            {t("agree")}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="mb-1 text-xs font-semibold text-[#9b91bf]">
                {item.label}
              </p>
              <p className="text-xs leading-6 text-[#4d4d4d]">{item.value}</p>
            </div>
          ))}

          <div className="col-span-2">
            <p className="mb-1 text-xs font-semibold text-[#9b91bf]">
              {t("camPopup.fields.agreementTerms")}
            </p>
            <ul
              className={cn(
                "list-disc text-xs leading-6 text-[#4d4d4d]",
                isRTL ? "pr-4" : "pl-4",
              )}>
              <li>{message.agreement.agreementTerms}</li>
            </ul>
          </div>
        </div>

        <CardDescription className="mt-2 px-1 text-[11px] text-[#a3a694]">
          {message.time}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function MessageBubble({
  message,
  isRTL,
  t,
}: {
  message: ChatMessage;
  isRTL: boolean;
  t: TFunction;
}) {
  const isOutgoing = message.sender === "me";
  const fallbackName = message.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={cn(
        "flex gap-1.5 sm:gap-3",
        isOutgoing ? "justify-start" : "justify-end",
      )}
      aria-label={
        isOutgoing ? (isRTL ? "رسالتك" : "Your message") : message.name
      }>
      {isOutgoing ? (
        <Avatar className="mt-1 h-4 w-4 sm:h-8 sm:w-8">
          <AvatarFallback className="bg-[#111267] text-[6px] font-semibold text-white sm:text-[10px]">
            {isRTL ? "أنت" : "You"}
          </AvatarFallback>
        </Avatar>
      ) : null}

      {message.type === "agreement" ? (
        <AgreementBubble message={message} isRTL={isRTL} t={t} />
      ) : (
        <div
          className={cn(
            "max-w-[78%] sm:max-w-[72%]",
            isRTL ? "text-right" : "text-left",
          )}>
          <Card
            className={cn(
              "border-0 py-0 shadow-sm ring-0",
              isOutgoing
                ? "bg-[#b8c99a] text-white"
                : "bg-[#fbfaf6] text-[#2f342d]",
            )}>
            <CardContent className="px-2.5 py-1.5 text-[8px] leading-4 sm:px-4 sm:py-2.5 sm:text-sm sm:leading-7">
              {message.text}
            </CardContent>
          </Card>
          <CardDescription className="mt-0.5 px-1 text-[7px] text-[#a3a694] sm:mt-1 sm:text-[11px]">
            {message.time}
          </CardDescription>
        </div>
      )}

      {!isOutgoing ? (
        <Avatar className="mt-1 h-5 w-5 sm:h-8 sm:w-8">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="text-[7px] sm:text-[10px]">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
      ) : null}
    </article>
  );
}

function MessageThread({
  conversation,
  isRTL,
  onAgreementSubmit,
}: MessageThreadProps) {
  const { t } = useTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <section
        className="relative overflow-hidden"
        aria-labelledby="message-thread-title">
        <figure className="relative h-36 overflow-hidden sm:h-75">
          <img
            src={hero}
            alt={t("infChat.heroAlt")}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </figure>

        <div className="relative -mt-1 rounded-t-[8px] bg-white px-2 pb-4 pt-3 sm:-mt-5 sm:rounded-t-[32px] sm:px-6 sm:pb-6 sm:pt-5 md:px-8">
          <Card className="mx-auto max-w-4xl border-0 bg-white py-0 shadow-none ring-0 sm:shadow-[0_8px_28px_rgba(40,44,35,0.04)]">
            <CardContent className="p-0 sm:p-6">
              <header
                className={cn(
                  "flex items-start justify-between gap-2 pb-2 sm:gap-4 sm:pb-4",
                  isRTL ? "flex-row" : "flex-row-reverse",
                )}>
                <div
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-3",
                    isRTL
                      ? "flex-row text-right"
                      : "flex-row-reverse text-left",
                  )}>
                  <Avatar className="h-6 w-6 sm:h-10 sm:w-10">
                    <AvatarImage
                      src={conversation.avatar}
                      alt={conversation.name}
                    />
                    <AvatarFallback className="text-[7px] sm:text-xs">
                      {conversation.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle
                      id="message-thread-title"
                      className="text-[9px] font-semibold text-[#22271f] sm:text-sm">
                      {conversation.name}
                    </CardTitle>
                    <CardDescription className="text-[7px] text-[#5e9f5c] sm:text-xs">
                      {conversation.roleLabel}
                    </CardDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  variant="outline"
                  className="h-6 rounded-[3px] border-[#ddd9cb] bg-[#f8f7f2] px-2 py-1 text-[7px] text-[#5d5a55] hover:bg-[#f3f1e9] sm:h-auto sm:rounded-[6px] sm:px-3 sm:text-xs">
                  {t("camPopup.trigger")}
                </Button>
              </header>

              <Separator className="bg-[#f0eee6]" />

              <div className="mt-2 sm:mt-4">
                <Badge
                  variant="outline"
                  className="w-full justify-center rounded-[3px] border-[#f4efcf] bg-[#fbf8e8] px-2 py-1.5 text-center text-[8px] font-normal whitespace-normal text-[#4f5148] sm:rounded-[8px] sm:px-4 sm:py-3 sm:text-sm">
                  {t("chat.thread.campaignBrief")}
                </Badge>
              </div>

              <ScrollArea className="mt-3 max-h-88 pr-1 sm:mt-5 sm:max-h-136">
                <div
                  className="space-y-3 bg-white py-1 sm:space-y-5"
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text">
                  {conversation.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isRTL={isRTL}
                      t={t}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-3 sm:mt-5">
                <MessageInput isRTL={isRTL} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <ConvertCampaignPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        campaignName={conversation.campaignName}
        onSubmitSuccess={onAgreementSubmit}
      />
    </>
  );
}

export default MessageThread;
