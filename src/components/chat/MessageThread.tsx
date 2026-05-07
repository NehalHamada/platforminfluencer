import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import ConvertCampaignPopup from "../common/ConvertCampaignPopup";
import { Button } from "../ui/Button";
import type { ChatConversation, ChatMessage } from "./ChatPage";
import MessageInput from "./MessageInput";

type MessageThreadProps = {
  conversation: ChatConversation;
  role: "company" | "influencer";
  isRTL: boolean;
  onAgreementSubmit: (data: ConvertCampaignFormData) => void;
  onSendMessage?: (text: string) => boolean | Promise<boolean> | void;
  isSending?: boolean;
  isLoadingMessages?: boolean;
};

function AgreementBubble({
  message,
  isRTL,
  t,
}: {
  message: ChatMessage;
  isRTL: boolean;
  t: any;
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
        </div>
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
  t: any;
}) {
  const isOutgoing = message.sender === "me";
  const fallbackName = message.name ? message.name.slice(0, 2).toUpperCase() : "??";

  return (
    <article
      className={cn(
        "flex w-full items-start gap-2 sm:gap-3",
        isOutgoing ? "flex-row-reverse" : "flex-row",
      )}>
      {!isOutgoing ? (
        <Avatar className="mt-1 h-5 w-5 sm:h-8 sm:w-8">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="text-[7px] sm:text-[10px]">
            {fallbackName}
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

      {isOutgoing ? (
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
  role,
  isRTL,
  onAgreementSubmit,
  onSendMessage,
  isSending,
  isLoadingMessages,
}: MessageThreadProps) {
  const { t } = useTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation.messages]);

  const introText = t("chat.thread.campaignBrief", "مرحباً، نرغب في التعاون معك في حملة تخص منتجات عناية بالبشرة، ونود معرفة مدى اهتمامك وتوفرك.");

  return (
    <div className="bg-white p-4 sm:p-10">
      <header
        className={cn(
          "flex items-center justify-between gap-2 pb-6 sm:gap-4",
          isRTL ? "flex-row" : "flex-row-reverse",
        )}>
        <div
          className={cn(
            "flex items-center gap-3 sm:gap-4",
            isRTL ? "flex-row text-right" : "flex-row-reverse text-left",
          )}>
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
            <AvatarImage
              src={conversation.avatar}
              alt={conversation.name}
            />
            <AvatarFallback className="text-xs sm:text-sm">
              {conversation.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-sm font-bold text-[#22271f] sm:text-lg">
              {conversation.name}
            </CardTitle>
            <CardDescription className="text-xs text-[#5e9f5c] sm:text-base">
              {conversation.roleLabel} {conversation.campaignName && `• ${conversation.campaignName}`}
            </CardDescription>
          </div>
        </div>

        {role === "company" ? (
          <Button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="h-10 rounded-[8px] border-[#ddd9cb] bg-[#f8f7f2] px-4 py-2 text-xs text-[#5d5a55] hover:bg-[#f3f1e9] sm:text-sm">
            {t("camPopup.trigger")}
          </Button>
        ) : null}
      </header>

      <Separator className="bg-[#f0eee6]" />

      <div className="mt-6">
        <div className="rounded-[12px] border-[#f4efcf] bg-[#fbf8e8] px-6 py-4 text-center text-xs font-medium text-[#4f5148] sm:text-base leading-relaxed">
          {introText}
        </div>
      </div>

      <ScrollArea
        ref={scrollRef}
        className="mt-8 h-[400px] lg:h-[450px]">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-6 bg-white py-6">
            {conversation.messages.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-center text-sm font-medium text-[#a3a694] sm:text-base">
                  {t("chat.thread.noMessages", "لا توجد رسائل بعد")}
                </p>
              </div>
            ) : (
              conversation.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isRTL={isRTL}
                  t={t}
                />
              ))
            )}
          </div>
        )}
      </ScrollArea>

      <div className="mt-8">
        <MessageInput
          isRTL={isRTL}
          onSendMessage={onSendMessage}
          isSending={isSending}
        />
      </div>

      <ConvertCampaignPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        campaignName={conversation.campaignName}
        onSubmitSuccess={onAgreementSubmit}
      />
    </div>
  );
}

export default MessageThread;
