import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
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
import { saveCompletedCampaignEntry } from "@/utils/completedCampaigns";
import type { InfluencerReviewInput } from "@/utils/influencerReviews";

import ConvertCampaignPopup from "../common/ConvertCampaignPopup";
import { Button } from "../ui/Button";
import { Eye, Send, Star, X } from "lucide-react";
import type { ChatConversation, ChatMessage } from "./ChatPage";
import MessageInput from "./MessageInput";

type ModificationRequestFormData = {
  modification_reason_id: string;
  modification_reason: string;
  new_delivery_date: string;
  description: string;
};

type MessageThreadProps = {
  conversation: ChatConversation;
  role: "company" | "influencer";
  isRTL: boolean;
  onAgreementSubmit: (
    data: ConvertCampaignFormData,
  ) => boolean | void | Promise<boolean | void>;
  onAgreementAction?: (
    messageId: string,
    status: "accepted" | "rejected",
  ) => boolean | Promise<boolean>;
  onSendMessage?: (text: string) => boolean | Promise<boolean> | void;
  onContentDeliverySubmit?: (data: {
    media_url: string;
    message: string;
    notes: string;
  }) => boolean | Promise<boolean>;
  onApproveContent?: (
    review: InfluencerReviewInput,
  ) => boolean | Promise<boolean>;
  onModificationRequestSubmit?: (
    data: ModificationRequestFormData,
  ) => boolean | Promise<boolean>;
  onModificationAction?: (
    messageId: string,
    status: "accepted" | "rejected",
    reason?: string,
  ) => boolean | Promise<boolean>;
  isSending?: boolean;
  isLoadingMessages?: boolean;
};

type AgreementStatus = "pending" | "accepted" | "rejected";
type ModificationStatus = "pending" | "accepted" | "rejected";

function AgreementBubble({
  message,
  isRTL,
  role,
  status,
  onAction,
}: {
  message: ChatMessage;
  isRTL: boolean;
  role: "company" | "influencer";
  status: AgreementStatus;
  onAction: (status: AgreementStatus) => void;
}) {
  const navigate = useNavigate();
  if (!message.agreement) return null;

  const items = [
    {
      label: isRTL ? "السعر" : "Price",
      value: message.agreement.final_price,
    },
    {
      label: isRTL ? "المحتوى" : "Deliverables",
      value: message.agreement.deliverables_count,
    },
    {
      label: isRTL ? "موعد التسليم" : "Delivery date",
      value: message.agreement.delivery_date,
    },
    {
      label: isRTL ? "ملاحظات" : "Notes",
      value: message.agreement.message,
    },
  ];
  const visibleItems = items.filter((item) => item.value);
  const showInfluencerActions = role === "influencer";
  const isResolved = status !== "pending";
  const isAccepted = status === "accepted";
  const statusLabel = isAccepted
    ? isRTL
      ? "تمت موافقة المؤثر"
      : "Influencer approved"
    : isRTL
      ? "لم يتم موافقة المؤثر"
      : "Pending influencer approval";

  return (
    <Card className="max-w-[88%] rounded-[6px] border border-[#e4e2dc] bg-[#eeeeed] py-0 shadow-none ring-0 sm:max-w-75">
      <CardHeader className="px-2.5 pb-0 pt-2.5">
        <div
          className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse justify-start" : "flex-row justify-start",
          )}>
          <span className="rounded-[3px] bg-white px-2 py-1 text-[9px] font-medium text-[#77736b] sm:text-[10px]">
            {isRTL ? "اتفاق نهائي" : "Final agreement"}
          </span>
          <span className="hidden rounded-[3px] border border-[#d3d0c7] bg-[#f7f7f6] px-2 py-1 text-[8px] font-medium text-[#6f6b63] sm:text-[9px]">
            {isRTL ? "لم يتم موافقة المؤثر" : "Pending influencer approval"}
          </span>
          <span className="rounded-[3px] border border-[#d3d0c7] bg-[#f7f7f6] px-2 py-1 text-[8px] font-medium text-[#6f6b63] sm:text-[9px]">
            {statusLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent
        className={cn("p-3 pt-2", isRTL ? "text-right" : "text-left")}>
        <ul className="space-y-1.5">
          {visibleItems.map((item) => (
            <li
              key={item.label}
              className={cn(
                "flex gap-1.5 text-[10px] leading-5 text-[#34342f] sm:text-[11px]",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}>
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#3f3f3a]" />
              <span>
                <span className="font-semibold">{item.label}: </span>
                {item.value}
              </span>
            </li>
          ))}
        </ul>

        {showInfluencerActions ? (
          <div
            className={cn(
              "mt-3 flex gap-2",
              isRTL
                ? "flex-row-reverse justify-start"
                : "flex-row justify-start",
            )}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResolved}
              onClick={() => onAction("accepted")}
              className={cn(
                "h-6 min-w-24 rounded-[3px] border-[#9cc69a] px-3 text-[9px] font-medium text-[#539153] hover:bg-[#f4faf3]",
                isAccepted ? "bg-[#edf6ec]" : "bg-white",
              )}>
              {isRTL ? "موافقة" : "Accept"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResolved}
              onClick={() => onAction("rejected")}
              className={cn(
                "h-6 min-w-24 rounded-[3px] border-[#e5a3a3] px-3 text-[9px] font-medium text-[#c85353] hover:bg-[#fff5f5]",
                "bg-white",
              )}>
              {isRTL ? "رفض الاتفاق" : "Reject"}
            </Button>
          </div>
        ) : null}

        {role === "company" && isAccepted ? (
          <Button
            type="button"
            onClick={() => navigate("/dashboard/company/campaign-payment")}
            className="mt-3 h-7 w-full rounded-[3px] bg-[#9fb88d] text-[10px] font-medium text-white hover:bg-[#91aa7f]">
            {isRTL ? "إنشاء الحملة" : "Create campaign"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MessageBubble({
  message,
  isRTL,
  role,
  agreementStatus,
  onAgreementAction,
  onRequestModification,
  onApproveContent,
  isContentApproved,
  modificationStatus,
  onModificationAction,
}: {
  message: ChatMessage;
  isRTL: boolean;
  role: "company" | "influencer";
  agreementStatus: AgreementStatus;
  onAgreementAction: (messageId: string, status: AgreementStatus) => void;
  onRequestModification: () => void;
  onApproveContent?: () => void;
  isContentApproved?: boolean;
  modificationStatus: ModificationStatus;
  onModificationAction: (
    messageId: string,
    status: "accepted" | "rejected",
    reason?: string,
  ) => void;
}) {
  const isOutgoing = message.sender === "me";
  const fallbackName = message.name
    ? message.name.slice(0, 2).toUpperCase()
    : "??";

  return (
    <article
      className={cn(
        "flex w-full items-start gap-2 sm:gap-3",
        isOutgoing ? "flex-row-reverse" : "flex-row",
      )}>
      {!isOutgoing ? (
        <Avatar className="mt-1 h-5 w-5 border border-[#e9e5da] sm:h-8 sm:w-8">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="text-[7px] sm:text-[10px]">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
      ) : null}

      {message.type === "agreement" ? (
        <AgreementBubble
          message={message}
          isRTL={isRTL}
          role={role}
          status={agreementStatus}
          onAction={(status) => onAgreementAction(message.id, status)}
        />
      ) : message.type === "content_delivery" ? (
        <ContentDeliveryBubble
          message={message}
          isRTL={isRTL}
          role={role}
          onRequestModification={onRequestModification}
          onApproveContent={onApproveContent}
          isContentApproved={isContentApproved}
        />
      ) : message.type === "content_approved" ? (
        <ContentApprovedNotice isRTL={isRTL} role={role} />
      ) : message.type === "modification_request" ? (
        <ModificationRequestBubble
          message={message}
          isRTL={isRTL}
          role={role}
          status={modificationStatus}
          onAction={(status, reason) => onModificationAction(message.id, status, reason)}
        />
      ) : (
        <div
          className={cn(
            "max-w-[78%] sm:max-w-[64%]",
            isRTL ? "text-right" : "text-left",
          )}>
          <Card
            className={cn(
              "rounded-[8px] border-0 py-0 shadow-none ring-0",
              isOutgoing
                ? "bg-[#eef0ec] text-[#2f342d]"
                : "bg-[#adbf9b] text-white",
            )}>
            <CardContent className="px-2.5 py-1.5 text-[8px] leading-4 sm:px-4 sm:py-2 sm:text-[13px] sm:leading-6">
              {message.text}
            </CardContent>
          </Card>
          <CardDescription className="mt-0.5 px-1 text-[7px] text-[#a3a694] sm:mt-1 sm:text-[11px]">
            {message.time}
          </CardDescription>
        </div>
      )}

      {isOutgoing ? (
        <Avatar className="mt-1 h-5 w-5 border border-[#e9e5da] sm:h-8 sm:w-8">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="text-[7px] sm:text-[10px]">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
      ) : null}
    </article>
  );
}

function ContentDeliveryBubble({
  message,
  isRTL,
  role,
  onRequestModification,
  onApproveContent,
  isContentApproved,
}: {
  message: ChatMessage;
  isRTL: boolean;
  role: "company" | "influencer";
  onRequestModification?: () => void;
  onApproveContent?: () => void;
  isContentApproved?: boolean;
}) {
  const { t } = useTranslation();
  const fileUrl = message.media_url || "";
  const isLocalFile = fileUrl.startsWith("local-file://");
  const localFileName = isLocalFile
    ? decodeURIComponent(fileUrl.replace("local-file://", ""))
    : "";
  const notes = message.notes || message.text;
  const isInfluencerView = role === "influencer";
  const currentUserName = (() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return "";
      const parsedUser = JSON.parse(storedUser) as {
        name?: string;
        company_name?: string;
      };
      return parsedUser.name || parsedUser.company_name || "";
    } catch {
      return "";
    }
  })();
  const deliveryOwnerName =
    message.name && message.name !== "Me"
      ? message.name
      : currentUserName ||
        t("chat.contentDelivery.influencerName", "Influencer");

  if (isInfluencerView) {
    return (
      <Card className="max-w-[72vw] overflow-hidden rounded-[5px] border border-[#e5e3dd] bg-[#f8f8f7] py-0 shadow-none ring-0 sm:max-w-60">
        <CardHeader className="rounded-t-[5px] bg-[#eeeeed] px-3 py-2">
          <div
            className={cn(
              "flex min-w-0 items-start justify-between gap-2 text-[8px] leading-4 text-[#34342f] sm:text-[10px]",
              isRTL ? "flex-row-reverse text-right" : "flex-row text-left",
            )}>
            <span className="min-w-0 truncate font-semibold">
              {deliveryOwnerName}
            </span>
            {fileUrl && !isLocalFile ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex min-w-0 max-w-[44%] items-center gap-1 text-[#77736b] hover:text-[#4f5148]",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}>
                <Eye className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {t("chat.contentDelivery.fileLabel", "File link")}
                </span>
              </a>
            ) : isLocalFile ? (
              <span
                className={cn(
                  "inline-flex min-w-0 max-w-[44%] items-center gap-1 text-[#77736b]",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}>
                <Eye className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{localFileName}</span>
              </span>
            ) : null}
          </div>
        </CardHeader>

        <CardContent
          className={cn("p-2.5", isRTL ? "text-right" : "text-left")}>
          {notes ? (
            <p className="mb-2.5 text-[8px] leading-4 text-[#5d5a55] sm:text-[10px] sm:leading-5">
              {notes}
            </p>
          ) : null}

          <Button
            type="button"
            disabled
            variant="outline"
            className="h-7 w-full rounded-lg border-[#e1ddd2] bg-white text-[8px] font-medium text-[#9d988e] opacity-100 sm:text-[10px]">
            {t(
              "chat.contentDelivery.waitingReview",
              "Waiting for company review",
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-[88%] rounded-[6px] border border-[#e4e2dc] bg-[#eeeeed] py-0 shadow-none ring-0 sm:max-w-77.5">
      <CardContent className={cn("p-3", isRTL ? "text-right" : "text-left")}>
        <div
          className={cn(
            "mb-2 flex items-center gap-2",
            isRTL ? "flex-row-reverse justify-start" : "flex-row justify-start",
          )}>
          <span className="rounded-[3px] bg-white px-2 py-1 text-[9px] font-medium text-[#4f5148] sm:text-[10px]">
            {t("chat.contentDelivery.cardTitle", "Content submitted")}
          </span>
          {role === "company" ? (
            <span className="text-[8px] font-medium text-[#d65b5b] sm:text-[10px]">
              {t(
                "chat.contentDelivery.pendingReview",
                "The influencer submitted content for review",
              )}
            </span>
          ) : null}
        </div>

        <div className="space-y-2 text-[10px] leading-5 text-[#34342f] sm:text-[11px]">
          {fileUrl && !isLocalFile ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-[3px] border border-[#d9d6cd] bg-white px-2 py-1 text-[#3f3f3a] underline-offset-2 hover:underline">
              {t("chat.contentDelivery.openFile", "Open file")}
            </a>
          ) : isLocalFile ? (
            <div className="block rounded-[3px] border border-[#d9d6cd] bg-white px-2 py-1 text-[#3f3f3a]">
              {localFileName}
            </div>
          ) : null}
          {notes ? (
            <p className="rounded-[3px] bg-white/65 px-2 py-1">
              <span className="font-semibold">
                {t("chat.contentDelivery.notesTitle", "Delivery notes")}:{" "}
              </span>
              {notes}
            </p>
          ) : null}
        </div>

        {role === "company" ? (
          <div
            className={cn(
              "mt-3 flex gap-2",
              isRTL
                ? "flex-row-reverse justify-start"
                : "flex-row justify-start",
            )}>
            <Button
              type="button"
              onClick={onRequestModification}
              disabled={isContentApproved}
              variant="outline"
              size="sm"
              className="h-6 min-w-24 rounded-[3px] border-[#e5a3a3] bg-white px-3 text-[9px] font-medium text-[#c85353] hover:bg-[#fff5f5]">
              {t("chat.contentDelivery.requestModification", "Request changes")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onApproveContent}
              disabled={isContentApproved}
              className="h-6 min-w-24 rounded-[3px] bg-[#42a756] px-3 text-[9px] font-medium text-white hover:bg-[#388e49]">
              {t("chat.contentDelivery.approveContent", "Approve content")}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ContentApprovedNotice({
  isRTL,
  role,
}: {
  isRTL: boolean;
  role: "company" | "influencer";
}) {
  const { t } = useTranslation();

  if (role !== "influencer") return null;

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[92%] rounded-lg bg-[#3faf4e] px-4 py-2 text-center text-[9px] font-medium leading-5 text-white shadow-none sm:max-w-140 sm:text-[12px]">
        {t(
          "chat.contentDelivery.approvedNotice",
          isRTL
            ? "قامت الشركة باعتماد المحتوى وتم إرسال اعتماده نهائيًا."
            : "The company approved the content and marked it as final.",
        )}
      </div>
    </div>
  );
}

function ModificationRequestBubble({
  message,
  isRTL,
  role,
  status,
  onAction,
}: {
  message: ChatMessage;
  isRTL: boolean;
  role: "company" | "influencer";
  status: ModificationStatus;
  onAction: (status: "accepted" | "rejected", reason?: string) => void;
}) {
  const { t } = useTranslation();
  const reason =
    message.modification_reason ||
    t("chat.modificationRequest.defaultReason", "Content needs changes");
  const deliveryDate = message.new_delivery_date || "-";
  const description = message.description || message.text || "-";
  const isResolved = status !== "pending";

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleRejectClick = () => {
    if (showRejectInput) {
      if (rejectReason.trim()) {
        onAction("rejected", rejectReason.trim());
      }
    } else {
      setShowRejectInput(true);
    }
  };

  return (
    <div className="max-w-[88%] sm:max-w-[320px]">
      {role === "influencer" ? (
        <div className="mb-2 rounded-[6px] bg-[#fffdef] py-2 text-center text-[10px] font-medium text-[#2f342d] sm:text-[11px]">
          {t(
            "chat.modificationRequest.systemNotice",
            "قامت الشركة بطلب تعديل المحتوى",
          )}
        </div>
      ) : null}

      <Card className="overflow-hidden rounded-[8px] border border-[#e4e2dc] bg-white py-0 shadow-none ring-0">
        <div className="bg-[#eef0f5] py-2.5 text-center">
          <span className="text-[10px] font-bold text-[#4f5148] sm:text-[11px]">
            {t("chat.modificationRequest.cardTitle", "طلب تعديل من الشركة")}
          </span>
        </div>

        <CardContent className={cn("p-0", isRTL ? "text-right" : "text-left")}>
          <div className="flex flex-col text-[10px] leading-5 text-[#34342f] sm:text-[11px]">
            <div className="border-b border-[#f1f0ec] px-4 py-2.5">
              <span className="block font-bold">
                {t("chat.modificationRequest.reason", "السبب")} :
              </span>
              <span className="block text-[#5d5a55]">{reason}</span>
            </div>
            
            <div className="border-b border-[#f1f0ec] px-4 py-2.5">
              <span className="block font-bold">
                {t("chat.modificationRequest.description", "التفاصيل المطلوبة")} :
              </span>
              <span className="block text-[#5d5a55]">{description}</span>
            </div>
            
            <div className="border-b border-[#f1f0ec] px-4 py-2.5">
              <span className="block font-bold">
                {t("chat.modificationRequest.type", "نوع التعديل")} :
              </span>
              <span className="block text-[#5d5a55]">
                {t("chat.modificationRequest.typeSimple", "بسيط")}
              </span>
            </div>

            <div className="border-b border-[#f1f0ec] px-4 py-2.5">
              <span className="block font-bold">
                {t(
                  "chat.modificationRequest.newDeliveryDate",
                  "موعد التسليم الجديد",
                )} :
              </span>
              <span className="block text-[#5d5a55]">{deliveryDate}</span>
            </div>

            <div className="bg-[#f8f8f7] py-2 text-center text-[9px] font-medium text-[#77736b] sm:text-[10px]">
              {status === "accepted" 
                ? t("chat.modificationRequest.statusAccepted", "تم الموافقة على التعديل")
                : status === "rejected"
                  ? t("chat.modificationRequest.statusRejected", "تم رفض التعديل")
                  : t("chat.modificationRequest.statusPending", "بانتظار النسخة المعدلة")}
            </div>
          </div>
        </CardContent>
      </Card>

      {role === "influencer" && !isResolved ? (
        <div className="mt-3 flex flex-col gap-3">
          <div
            className={cn(
              "flex gap-2",
              isRTL
                ? "flex-row-reverse justify-center"
                : "flex-row justify-center",
            )}>
            <Button
              type="button"
              size="sm"
              disabled={isResolved}
              onClick={() => onAction("accepted")}
              className="h-7 min-w-28 rounded-[4px] bg-[#3daf4e] px-3 text-[10px] font-medium text-white hover:bg-[#349642]">
              {t("chat.modificationRequest.accept", "الموافقة على التعديل")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isResolved && !showRejectInput}
              onClick={handleRejectClick}
              className="h-7 min-w-28 rounded-[4px] bg-[#e62e2e] px-3 text-[10px] font-medium text-white hover:bg-[#cc2929]">
              {t("chat.modificationRequest.reject", "الاعتراض على التعديل")}
            </Button>
          </div>

          {showRejectInput ? (
            <div className="mt-2 text-center">
              <p className="mb-2 text-[10px] font-medium text-[#2f342d] sm:text-[11px]">
                {t("chat.modificationRequest.rejectReasonPrompt", "من فضلك قم بإدخال سبب الاعتراض لضمان حقوقك")}
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="h-9 w-full rounded-full border border-[#d3d0c7] bg-white pl-10 pr-4 text-[10px] text-[#34342f] outline-none placeholder:text-[#a3a694] focus:border-[#9fb88d] sm:text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleRejectClick}
                  disabled={!rejectReason.trim()}
                  className="absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#9fb88d] text-white transition hover:bg-[#8da87c] disabled:opacity-50"
                >
                  <Send className={cn("h-3.5 w-3.5", isRTL ? "rotate-180" : "")} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ModificationRequestPopup({
  open,
  isRTL,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isRTL: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (data: ModificationRequestFormData) => boolean | Promise<boolean>;
}) {
  const { t } = useTranslation();
  const [reasonId, setReasonId] = useState("1");
  const [newDeliveryDate, setNewDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const reasons = [
    {
      id: "1",
      name: t(
        "chat.modificationRequest.defaultReason",
        "Content needs changes",
      ),
    },
    {
      id: "2",
      name: t("chat.modificationRequest.reasonQuality", "Quality improvement"),
    },
    {
      id: "3",
      name: t("chat.modificationRequest.reasonBrand", "Brand guidelines"),
    },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reasonId || !newDeliveryDate || !description.trim()) {
      setError(
        t(
          "chat.modificationRequest.required",
          "Please complete the modification reason, date, and details.",
        ),
      );
      return;
    }

    setError("");
    const selectedReason = reasons.find((reason) => reason.id === reasonId);
    const saved = await onSubmit?.({
      modification_reason_id: reasonId,
      modification_reason: selectedReason?.name || reasons[0].name,
      new_delivery_date: newDeliveryDate,
      description: description.trim(),
    });

    if (saved === false) {
      setError(
        t(
          "chat.modificationRequest.submitFailed",
          "Could not send the modification request. Please try again.",
        ),
      );
      return;
    }

    setReasonId("1");
    setNewDeliveryDate("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true">
      <form
        dir={isRTL ? "rtl" : "ltr"}
        onSubmit={handleSubmit}
        className="relative w-full max-w-140 rounded-[6px] bg-white px-6 py-7 shadow-[0_16px_60px_rgba(0,0,0,0.22)] sm:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", "Close")}
          className={cn(
            "absolute top-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#e1ddd2] bg-white text-[#77736b] transition hover:bg-[#f7f6f1]",
            isRTL ? "left-4" : "right-4",
          )}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <h2 className="mx-auto mb-7 w-fit border-b border-[#20231f] pb-1 text-center text-[12px] font-semibold text-[#22271f] sm:text-[13px]">
          {t("chat.modificationRequest.popupTitle", "Content modification")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[10px] font-medium text-[#34342f]">
              {t("chat.modificationRequest.reasonLabel", "Reason")}
            </span>
            <select
              value={reasonId}
              onChange={(event) => setReasonId(event.target.value)}
              className="h-8 w-full rounded-full border border-[#e1ddd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none focus:border-[#9fb88d] sm:text-[11px]">
              {reasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-medium text-[#34342f]">
              {t(
                "chat.modificationRequest.deliveryDateLabel",
                "New delivery date",
              )}
            </span>
            <input
              type="date"
              value={newDeliveryDate}
              onChange={(event) => setNewDeliveryDate(event.target.value)}
              className="h-8 w-full rounded-full border border-[#e1ddd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none focus:border-[#9fb88d] sm:text-[11px]"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-[10px] font-medium text-[#34342f]">
            {t("chat.modificationRequest.detailsLabel", "Modification details")}
          </span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t(
              "chat.modificationRequest.detailsPlaceholder",
              "Write the requested changes",
            )}
            className="h-8 w-full rounded-full border border-[#e1ddd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none placeholder:text-[#b8b5ad] focus:border-[#9fb88d] sm:text-[11px]"
          />
        </label>

        {error ? (
          <p className="mt-3 text-center text-xs font-medium text-[#c85353]">
            {error}
          </p>
        ) : null}

        <div
          className={cn("mt-5 flex", isRTL ? "justify-start" : "justify-end")}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-8 min-w-36 rounded-full bg-[#9fb88d] px-6 text-[10px] font-semibold text-white hover:bg-[#91aa7f] sm:text-[11px]">
            {isSubmitting
              ? t("chat.modificationRequest.submitting", "Sending...")
              : t(
                  "chat.modificationRequest.submit",
                  "Send modification request",
                )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ContentDeliveryPopup({
  open,
  isRTL,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isRTL: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    media_url: string;
    message: string;
    notes: string;
  }) => boolean | Promise<boolean>;
}) {
  const { t } = useTranslation();
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const normalizeMediaUrl = (value: string) => {
    const trimmedValue = value.trim();
    if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;
    return `https://${trimmedValue}`;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setMediaFile(file);
    if (file) {
      setMediaUrl(file.name);
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = mediaUrl.trim();
    const trimmedNotes = notes.trim();

    if ((!trimmedUrl && !mediaFile) || !trimmedNotes) {
      setError(
        t(
          "chat.contentDelivery.required",
          "Please add the content link and delivery notes",
        ),
      );
      return;
    }

    const selectedMediaUrl = mediaFile
      ? `local-file://${encodeURIComponent(mediaFile.name)}`
      : normalizeMediaUrl(trimmedUrl);
    if (!mediaFile && !/^https?:\/\/\S+\.\S+/i.test(selectedMediaUrl)) {
      setError(
        t(
          "chat.contentDelivery.invalidUrl",
          "Please add a valid public link starting with https://",
        ),
      );
      return;
    }

    setError("");
    try {
      const saved = await onSubmit?.({
        media_url: selectedMediaUrl,
        message: trimmedNotes,
        notes: trimmedNotes,
      });

      if (saved === false) {
        setError(
          t(
            "chat.contentDelivery.submitFailed",
            "Could not send the content. Please check the link and try again.",
          ),
        );
        return;
      }

      setMediaUrl("");
      setMediaFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotes("");
      onClose();
    } catch (submitError) {
      console.error("Content delivery submit error:", submitError);
      setError(
        t(
          "chat.contentDelivery.submitFailed",
          "Could not send the content. Please check the link and try again.",
        ),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true">
      <form
        dir={isRTL ? "rtl" : "ltr"}
        onSubmit={handleSubmit}
        className="relative w-full max-w-140 rounded-[6px] bg-white px-6 py-7 shadow-[0_16px_60px_rgba(0,0,0,0.22)] sm:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", "Close")}
          className={cn(
            "absolute top-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#e1ddd2] bg-white text-[#77736b] transition hover:bg-[#f7f6f1]",
            isRTL ? "left-4" : "right-4",
          )}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <h2 className="mx-auto mb-7 w-fit border-b border-[#20231f] pb-1 text-center text-[12px] font-semibold text-[#22271f] sm:text-[13px]">
          {t(
            "chat.contentDelivery.modalTitle",
            "Submit the content for company review",
          )}
        </h2>

        <label className="mb-4 block">
          <span
            className={cn(
              "mb-2 block text-[10px] font-medium text-[#34342f]",
              isRTL ? "text-right" : "text-left",
            )}>
            {t(
              "chat.contentDelivery.mediaLabel",
              "File / video / image or Drive link",
            )}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            value={mediaUrl}
            onClick={() => fileInputRef.current?.click()}
            onChange={(event) => {
              setMediaFile(null);
              setMediaUrl(event.target.value);
            }}
            placeholder={t(
              "chat.contentDelivery.mediaPlaceholder",
              "Paste the link here",
            )}
            className="h-8 w-full cursor-pointer rounded-full border border-[#e1ddd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none placeholder:text-[#b8b5ad] focus:border-[#9fb88d] sm:text-[11px]"
          />
        </label>

        <label className="mb-4 block">
          <span
            className={cn(
              "mb-2 block text-[10px] font-medium text-[#34342f]",
              isRTL ? "text-right" : "text-left",
            )}>
            {t("chat.contentDelivery.notesLabel", "Delivery notes")}
          </span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t(
              "chat.contentDelivery.notesPlaceholder",
              "Write details or notes for the company",
            )}
            className="h-8 w-full rounded-full border border-[#e1ddd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none placeholder:text-[#b8b5ad] focus:border-[#9fb88d] sm:text-[11px]"
          />
        </label>

        {error ? (
          <p className="mb-3 text-center text-xs font-medium text-[#c85353]">
            {error}
          </p>
        ) : null}

        <div className={cn("flex", isRTL ? "justify-start" : "justify-end")}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-8 min-w-32 rounded-full bg-[#9fb88d] px-6 text-[10px] font-semibold text-white hover:bg-[#91aa7f] sm:text-[11px]">
            {isSubmitting
              ? t("chat.contentDelivery.submitting", "Sending...")
              : t("chat.contentDelivery.submit", "Send for review")}
          </Button>
        </div>
      </form>
    </div>
  );
}

function StarRatingInput({
  label,
  value,
  onChange,
  isRTL,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isRTL: boolean;
}) {
  return (
    <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
      <p className="text-[10px] font-medium text-[#34342f] sm:text-[11px]">
        {label}
      </p>
      <div
        className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse justify-center" : "justify-center",
        )}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8f9488] transition hover:bg-[#f1f3ec]">
            <Star
              className={cn(
                "h-4 w-4",
                rating <= value
                  ? "fill-[#f7caa9] text-[#f7caa9]"
                  : "fill-white text-[#8f9488]",
              )}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

function InfluencerReviewPopup({
  open,
  isRTL,
  isSubmitting,
  influencerName,
  campaignName,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isRTL: boolean;
  isSubmitting?: boolean;
  influencerName?: string;
  campaignName?: string;
  onClose: () => void;
  onSubmit?: (review: InfluencerReviewInput) => boolean | Promise<boolean>;
}) {
  const { t } = useTranslation();
  const [scheduleCommitment, setScheduleCommitment] = useState(0);
  const [contentQuality, setContentQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!scheduleCommitment || !contentQuality || !communication) {
      setError(
        t(
          "chat.review.required",
          isRTL ? "من فضلك أكمل كل التقييمات" : "Please complete all ratings",
        ),
      );
      return;
    }

    setError("");
    const saved = await onSubmit?.({
      influencerName,
      campaignName,
      scheduleCommitment,
      contentQuality,
      communication,
      comment: comment.trim(),
    });

    if (saved === false) {
      setError(
        t(
          "chat.review.submitFailed",
          isRTL
            ? "تعذر إرسال التقييم، حاول مرة أخرى"
            : "Could not send the review. Please try again.",
        ),
      );
      return;
    }

    setScheduleCommitment(0);
    setContentQuality(0);
    setCommunication(0);
    setComment("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-3 py-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true">
      <form
        dir={isRTL ? "rtl" : "ltr"}
        onSubmit={handleSubmit}
        className="relative flex max-h-[92vh] w-full max-w-126 flex-col overflow-hidden rounded-[22px] bg-[#f7f7f6] shadow-[0_20px_70px_rgba(0,0,0,0.28)] sm:rounded-[26px]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", "Close")}
          className={cn(
            "absolute top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#dedbd2] bg-white text-[#77736b] transition hover:bg-[#f0efe9]",
            isRTL ? "left-4" : "right-4",
          )}>
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="overflow-y-auto px-6 pb-6 pt-7 sm:px-10">
          <div className="mx-auto mb-5 w-fit border-b border-[#20231f] pb-1 text-center text-[13px] font-semibold text-[#22271f]">
            {t("chat.review.title", isRTL ? "قيّم المؤثر" : "Rate influencer")}
          </div>

          <div className="mx-auto mb-6 grid max-w-78 grid-cols-[1fr_auto] items-center gap-5">
            <div className="space-y-3">
              <div className="h-13 rounded-[3px] border border-[#b9b9b9] bg-white px-5 py-2">
                <div className="mb-1 h-1.5 w-22 rounded-full bg-[#c9c9c9]" />
                <div className="h-1.5 w-16 rounded-full bg-[#d8d8d8]" />
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={`preview-a-${rating}`}
                    className={cn(
                      "h-3 w-3",
                      rating <= 3
                        ? "fill-[#f7caa9] text-[#f7caa9]"
                        : "fill-white text-[#8f9488]",
                    )}
                  />
                ))}
              </div>
              <div className="h-13 rounded-[3px] border border-[#b9b9b9] bg-white px-5 py-2">
                <div className="mb-1 h-1.5 w-22 rounded-full bg-[#c9c9c9]" />
                <div className="h-1.5 w-16 rounded-full bg-[#d8d8d8]" />
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={`preview-b-${rating}`}
                    className={cn(
                      "h-3 w-3",
                      rating <= 4
                        ? "fill-[#f7caa9] text-[#f7caa9]"
                        : "fill-white text-[#8f9488]",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="h-31 w-16 rounded-b-full rounded-t-[32px] bg-[#30364a]" />
          </div>

          <div className="space-y-4">
            <StarRatingInput
              label={t(
                "chat.review.scheduleCommitment",
                isRTL ? "الالتزام بالمواعيد" : "Schedule commitment",
              )}
              value={scheduleCommitment}
              onChange={setScheduleCommitment}
              isRTL={isRTL}
            />

            <label className={cn("block", isRTL ? "text-right" : "text-left")}>
              <span className="mb-2 block text-[10px] font-medium text-[#34342f] sm:text-[11px]">
                {t("chat.review.comment", isRTL ? "تعليق" : "Comment")}
              </span>
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t(
                  "chat.review.commentPlaceholder",
                  isRTL
                    ? "ممتاز كانت تجربة جيدة جداً ونوصي به لهذه التعاونات"
                    : "Great experience and we recommend this influencer",
                )}
                className="h-8 w-full rounded-full border border-[#dedbd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none placeholder:text-[#8d887e] focus:border-[#9fb88d] sm:text-[11px]"
              />
            </label>

            <StarRatingInput
              label={t(
                "chat.review.contentQuality",
                isRTL ? "جودة المحتوى" : "Content quality",
              )}
              value={contentQuality}
              onChange={setContentQuality}
              isRTL={isRTL}
            />

            <StarRatingInput
              label={t(
                "chat.review.communication",
                isRTL ? "سهولة التواصل" : "Communication",
              )}
              value={communication}
              onChange={setCommunication}
              isRTL={isRTL}
            />
          </div>

          {error ? (
            <p className="mt-3 text-center text-xs font-medium text-[#c85353]">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "h-9 min-w-42 rounded-full bg-[#8d9978] px-5 text-[10px] font-semibold text-white hover:bg-[#7f8d6d] sm:text-[11px]",
                isRTL ? "flex-row" : "flex-row-reverse",
              )}>
              <Send className="h-3.5 w-3.5" />
              {isSubmitting
                ? t(
                    "chat.review.submitting",
                    isRTL ? "جارٍ الإرسال..." : "Sending...",
                  )
                : t(
                    "chat.review.submit",
                    isRTL ? "إرسال التقييم" : "Send review",
                  )}
            </Button>
          </div>
        </div>

        <div className="bg-[linear-gradient(100deg,#252923_0%,#30352f_100%)] px-6 py-5 text-center text-white">
          <p className="text-[11px] font-semibold">
            {t("chat.review.footerBrand", "GROWTH")}
          </p>
          <p className="mx-auto mt-2 max-w-82 text-[10px] leading-5 text-white/90">
            {t(
              "chat.review.footerText",
              isRTL
                ? "منصة تربط بين الشركات والمؤثرين عبر تعاونات منظمة، شفافة، ومبنية على نتائج حقيقية"
                : "A platform for organized, transparent collaborations built on real results",
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

function MessageThread({
  conversation,
  role,
  isRTL,
  onAgreementSubmit,
  onAgreementAction,
  onSendMessage,
  onContentDeliverySubmit,
  onApproveContent,
  onModificationRequestSubmit,
  onModificationAction,
  isSending,
  isLoadingMessages,
}: MessageThreadProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeliveryPopupOpen, setIsDeliveryPopupOpen] = useState(false);
  const [isModificationPopupOpen, setIsModificationPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [agreementActions, setAgreementActions] = useState<
    Record<string, AgreementStatus>
  >({});
  const [modificationActions, setModificationActions] = useState<
    Record<string, ModificationStatus>
  >({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const getMessageAgreementStatus = (message: ChatMessage): AgreementStatus =>
    agreementActions[message.id] ?? message.agreement_status ?? "pending";
  const getMessageModificationStatus = (
    message: ChatMessage,
  ): ModificationStatus =>
    modificationActions[message.id] ?? message.modification_status ?? "pending";
  const hasAcceptedAgreement = conversation.messages.some(
    (message) =>
      message.type === "agreement" &&
      getMessageAgreementStatus(message) === "accepted",
  );
  const handleAgreementAction = async (
    messageId: string,
    nextStatus: AgreementStatus,
  ) => {
    if (nextStatus === "pending") return;
    const saved = await onAgreementAction?.(messageId, nextStatus);
    if (saved === false) return;

    setAgreementActions((current) => ({
      ...current,
      [messageId]: current[messageId] ?? nextStatus,
    }));
  };
  const handleModificationAction = async (
    messageId: string,
    nextStatus: "accepted" | "rejected",
  ) => {
    const saved = await onModificationAction?.(messageId, nextStatus);
    if (saved === false) return;

    setModificationActions((current) => ({
      ...current,
      [messageId]: current[messageId] ?? nextStatus,
    }));
  };

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

  const introText = t(
    "chat.thread.campaignBrief",
    "مرحباً، نرغب في التعاون معك في حملة تخص منتجات عناية بالبشرة، ونود معرفة مدى اهتمامك وتوفرك.",
  );
  const hasContentApproved = conversation.messages.some(
    (message) => message.type === "content_approved",
  );

  useEffect(() => {
    if (role !== "influencer" || !hasContentApproved) return;

    const redirectKey = `content-approved-publish-${conversation.id}`;
    if (sessionStorage.getItem(redirectKey)) return;
    sessionStorage.setItem(redirectKey, "1");
    saveCompletedCampaignEntry({
      conversationId: conversation.id,
      applicationId: conversation.applicationId,
      campaignId: conversation.campaignId,
      campaignName: conversation.campaignName,
      amount: conversation.campaignBudget,
      category: conversation.category,
      companyName: conversation.name,
      date: new Date().toISOString(),
    });

    navigate("/dashboard/influencer/campaigns", { replace: true });
  }, [
    conversation.applicationId,
    conversation.campaignBudget,
    conversation.campaignId,
    conversation.campaignName,
    conversation.category,
    conversation.id,
    conversation.name,
    hasContentApproved,
    navigate,
    role,
  ]);

  return (
    <div className="bg-white px-3 py-4 sm:px-8 sm:py-7 lg:px-10">
      <header
        className={cn(
          "flex items-start justify-between gap-3 border-b border-[#f2efe6] pb-4 sm:gap-4 sm:pb-5",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}>
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-3",
            isRTL ? "flex-row text-right" : "flex-row-reverse text-left",
          )}>
          <Avatar className="h-9 w-9 border border-[#ede8dc] sm:h-12 sm:w-12">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="text-xs sm:text-sm">
              {conversation.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-[11px] font-bold text-[#22271f] sm:text-sm">
              {conversation.name}
            </CardTitle>
            <CardDescription className="mt-0.5 text-[8px] text-[#5e9f5c] sm:text-xs">
              {conversation.roleLabel}{" "}
              {conversation.campaignName && `• ${conversation.campaignName}`}
            </CardDescription>
          </div>
        </div>

        {role === "company" ? (
          <Button
            type="button"
            onClick={() => {
              if (!hasAcceptedAgreement) setIsPopupOpen(true);
            }}
            variant="outline"
            className={cn(
              "h-8 rounded-lg px-3 py-1.5 text-[9px] shadow-none sm:h-9 sm:px-4 sm:text-xs",
              hasAcceptedAgreement
                ? "border-[#7daf68] bg-[#42a756] text-white opacity-100 hover:bg-[#42a756]"
                : "border-[#ddd9cb] bg-white text-[#5d5a55] hover:bg-[#f3f1e9]",
            )}>
            {hasAcceptedAgreement
              ? isRTL
                ? "تم تحويل الاتفاق لحملة"
                : "Agreement converted"
              : t("camPopup.trigger")}
          </Button>
        ) : role === "influencer" ? (
          <Button
            type="button"
            onClick={() => setIsDeliveryPopupOpen(true)}
            variant="outline"
            className="h-8 rounded-lg border-[#ddd9cb] bg-white px-3 py-1.5 text-[9px] text-[#5d5a55] shadow-none hover:bg-[#f3f1e9] sm:h-9 sm:px-4 sm:text-xs">
            {t("chat.contentDelivery.trigger", "Deliver content")}
          </Button>
        ) : null}
      </header>

      {role === "influencer" && hasContentApproved ? (
        <div className="mt-4 sm:mt-5">
          <ContentApprovedNotice isRTL={isRTL} role={role} />
        </div>
      ) : null}

      <Separator className="hidden bg-[#f0eee6]" />

      <div className="mt-4 sm:mt-6">
        <div className="rounded-[8px] border border-[#f8f1cf] bg-[#fffdf0] px-3 py-2 text-center text-[9px] font-medium leading-5 text-[#4f5148] sm:px-6 sm:py-3 sm:text-xs sm:leading-6">
          {introText}
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="mt-5 h-102.5 sm:h-125 lg:h-140">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-5 bg-white py-4 sm:space-y-6 sm:py-6">
            {conversation.messages.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-center text-sm font-medium text-[#a3a694] sm:text-base">
                  {t("chat.thread.noMessages", "لا توجد رسائل بعد")}
                </p>
              </div>
            ) : (
              conversation.messages
                .filter((message) => {
                  if (message.type === "content_approved") return false;
                  if (
                    role === "influencer" &&
                    hasContentApproved &&
                    message.type === "agreement"
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isRTL={isRTL}
                    role={role}
                    agreementStatus={getMessageAgreementStatus(message)}
                    onAgreementAction={handleAgreementAction}
                    onRequestModification={() =>
                      setIsModificationPopupOpen(true)
                    }
                    onApproveContent={() => setIsReviewPopupOpen(true)}
                    isContentApproved={hasContentApproved}
                    modificationStatus={getMessageModificationStatus(message)}
                    onModificationAction={handleModificationAction}
                  />
                ))
            )}
          </div>
        )}
      </ScrollArea>

      <div className="mt-4 sm:mt-6">
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
        isSubmitting={isSending}
      />

      <ContentDeliveryPopup
        open={isDeliveryPopupOpen}
        isRTL={isRTL}
        onClose={() => setIsDeliveryPopupOpen(false)}
        onSubmit={onContentDeliverySubmit}
        isSubmitting={isSending}
      />

      <ModificationRequestPopup
        open={isModificationPopupOpen}
        isRTL={isRTL}
        onClose={() => setIsModificationPopupOpen(false)}
        onSubmit={onModificationRequestSubmit}
        isSubmitting={isSending}
      />

      <InfluencerReviewPopup
        open={isReviewPopupOpen}
        isRTL={isRTL}
        onClose={() => setIsReviewPopupOpen(false)}
        onSubmit={onApproveContent}
        isSubmitting={isSending}
        influencerName={conversation.name}
        campaignName={conversation.campaignName}
      />
    </div>
  );
}

export default MessageThread;
