import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  Check,
  Circle,
  MessageCircleMore,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

import { queryKeys } from "@/constants/queryKeys";
import { cn } from "@/lib/utils";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { chatService } from "@/services/chat.service";
import type {
  CampaignRequest,
  CollaborationRequest,
} from "@/types/campaign.types";
import {
  getCampaignProgressStepCount,
  isContentApprovedStatus,
  normalizeCampaignStatus,
} from "@/utils/campaignProgress";
import { saveCompletedCampaignEntry } from "@/utils/completedCampaigns";
import {
  getContentMessageMediaUrl,
  getContentMessageNotes,
  getLatestContentMessage,
} from "@/utils/completedCampaignSource";
import { getConversationIdFromResponse } from "@/utils/apiResponse";

type PublishView = "tracking" | "form";

type TrackStep = {
  id: number;
  label: string;
};

type PublishApplication = CampaignRequest | CollaborationRequest;
type PublishRouteState = {
  conversationId?: string | number;
  campaignId?: string | number;
  applicationId?: string | number;
  campaignName?: string;
} | null;

const trackingSteps: TrackStep[] = [
  { id: 1, label: "تم الاتفاق" },
  { id: 2, label: "تم تسليم المحتوى" },
  { id: 3, label: "تم نشر المحتوى" },
];

const getCampaignId = (application: PublishApplication) =>
  application.campaign?.id ?? application.campaign_id;

const getStatusLabel = (status?: string | null) => {
  const normalizedStatus = normalizeCampaignStatus(status);

  switch (normalizedStatus) {
    case "content_approved":
    case "approved_content":
    case "published":
    case "completed":
    case "complete":
      return "تمت الموافقة على المحتوى";
    case "modification_requested":
      return "مطلوب تعديل";
    case "accepted":
    case "accept":
    case "approved":
      return "نشط";
    case "rejected":
      return "مرفوض";
    default:
      return "قيد المراجعة";
  }
};

const getCompletedSteps = (
  status?: string | null,
  hasDeliveredContent = false,
) => {
  const normalizedStatus = normalizeCampaignStatus(status);

  switch (normalizedStatus) {
    case "content_approved":
    case "approved_content":
    case "published":
    case "completed":
    case "complete":
      return 3;
    case "modification_requested":
      return 2;
    case "accepted":
    case "accept":
    case "approved":
      return hasDeliveredContent ? 2 : 1;
    default:
      return Math.max(
        getCampaignProgressStepCount(status),
        hasDeliveredContent ? 2 : 0,
      );
  }
};

function CampaignPublish() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { campaignId: campaignIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [view, setView] = useState<PublishView>("tracking");
  const [form, setForm] = useState({
    mediaUrl: "",
    description: "",
    publishDate: "",
  });

  const applicationsQuery = useCampaignRequestsQuery();
  const collaborationRequestsQuery = useCollaborationRequestsQuery();
  const conversationsQuery = useConversationsQuery();
  const routeState = location.state as PublishRouteState;

  const application = useMemo(() => {
    const applications = [
      ...(applicationsQuery.data?.data ?? []),
      ...(collaborationRequestsQuery.data?.data ?? []),
    ].filter((item) => item.campaign);

    if (applicationId) {
      const byApplication = applications.find(
        (item) => String(item.id) === String(applicationId),
      );
      if (byApplication) return byApplication;
    }

    if (campaignIdParam) {
      const byCampaign = applications.find(
        (item) => String(getCampaignId(item)) === String(campaignIdParam),
      );
      if (byCampaign) return byCampaign;
    }

    return (
      applications.find((item) => isContentApprovedStatus(item.status)) ??
      applications.find(
        (item) =>
          ["accepted", "accept", "approved", "modification_requested"].indexOf(
            normalizeCampaignStatus(item.status),
          ) !== -1,
      ) ??
      applications[0]
    );
  }, [
    applicationId,
    applicationsQuery.data?.data,
    campaignIdParam,
    collaborationRequestsQuery.data?.data,
  ]);

  const campaign = application?.campaign;
  const campaignId = application ? getCampaignId(application) : undefined;
  const conversationFromList = conversationsQuery.data?.data.find(
    (conversation) => {
      const conversationApplicationId =
        conversation.application_id ?? conversation.applicationId;
      const conversationCampaignId =
        conversation.campaign_id ?? conversation.campaignId;

      if (
        application?.id &&
        conversationApplicationId &&
        String(conversationApplicationId) === String(application.id)
      ) {
        return true;
      }

      if (
        campaignId &&
        conversationCampaignId &&
        String(conversationCampaignId) === String(campaignId)
      ) {
        return true;
      }

      return false;
    },
  );
  const conversationId =
    getConversationIdFromResponse(application) ??
    application?.conversation_id ??
    campaign?.conversation_id ??
    routeState?.conversationId ??
    conversationFromList?.id;
  const status = normalizeCampaignStatus(application?.status);
  const messagesQuery = useQuery({
    queryKey: queryKeys.chat.messages(conversationId),
    queryFn: () => chatService.getMessages(conversationId as string | number),
    enabled: Boolean(conversationId),
  });
  const hasDeliveredContent = Boolean(
    messagesQuery.data?.data.some(
      (message) =>
        message.type === "content_delivery" ||
        message.type === "video_submission",
    ),
  );
  const hasApprovedMessage = Boolean(
    messagesQuery.data?.data.some(
      (message) =>
        String(message.type ?? "") === "content_approved" ||
        String(message.message ?? "").indexOf("__content_approved__") === 0,
    ),
  );
  const isApprovedFromEndpoint = isContentApprovedStatus(application?.status);
  const isApproved = isApprovedFromEndpoint || hasApprovedMessage;
  const statusLabel = isApproved
    ? "تمت الموافقة على المحتوى"
    : hasDeliveredContent
      ? "بانتظار موافقة الشركة"
      : getStatusLabel(application?.status);
  const completedSteps = getCompletedSteps(
    isApproved ? "content_approved" : application?.status,
    hasDeliveredContent,
  );
  const companyName =
    campaign?.user?.company_name ||
    campaign?.company_name ||
    campaign?.user?.name ||
    "-";
  const campaignName =
    campaign?.name ||
    campaign?.campaign_type?.name ||
    campaign?.campaignType?.name ||
    campaign?.campaign_type_name ||
    campaign?.idea ||
    "-";
  const amount =
    application?.price ||
    campaign?.budget_range?.name ||
    campaign?.budgetRange?.name ||
    campaign?.budget_range_name ||
    "-";
  const date =
    (application && "execution_date" in application
      ? application.execution_date
      : undefined) ||
    campaign?.execution_time?.name ||
    campaign?.executionTime?.name ||
    campaign?.created_at ||
    "-";

  useEffect(() => {
    if (!application || !isApproved) return;
    const latestContentMessage = getLatestContentMessage(
      messagesQuery.data?.data,
    );

    saveCompletedCampaignEntry({
      conversationId,
      applicationId: application.id,
      campaignId,
      campaignName,
      companyName,
      amount,
      category:
        campaign?.campaign_type?.name ??
        campaign?.campaignType?.name ??
        campaign?.campaign_type_name,
      mediaUrl: getContentMessageMediaUrl(latestContentMessage),
      notes: getContentMessageNotes(latestContentMessage),
      date: String(date ?? ""),
    });

    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.myApplications(),
      }),
      queryClient.invalidateQueries({
        queryKey: ["campaigns", "collaboration-requests"],
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencer(),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.influencerEarnings(),
      }),
    ]);
  }, [
    amount,
    application,
    campaign?.campaignType?.name,
    campaign?.campaign_type?.name,
    campaign?.campaign_type_name,
    campaignId,
    campaignName,
    companyName,
    conversationId,
    date,
    isApproved,
    messagesQuery.data?.data,
    queryClient,
  ]);

  const submitContentMutation = useMutation({
    mutationFn: () => {
      if (!conversationId) {
        throw new Error("لا توجد محادثة مرتبطة بهذه الحملة");
      }

      return chatService.sendMessage({
        conversation_id: conversationId,
        type: "content_delivery",
        media_url: form.mediaUrl,
        message: form.description || "تم إرسال محتوى الحملة للمراجعة",
        notes: form.publishDate
          ? `تاريخ النشر المقترح: ${form.publishDate}`
          : null,
      });
    },
    onSuccess: async () => {
      toast.success("تم إرسال المحتوى للشركة للمراجعة");
      setView("tracking");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.myApplications(),
        }),
        queryClient.invalidateQueries({
          queryKey: ["campaigns", "collaboration-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.conversations(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.messages(conversationId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.influencer(),
        }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "تعذر إرسال المحتوى، حاول مرة أخرى",
      );
    },
  });

  const handleAction = () => {
    if (isApproved) {
      navigate("/dashboard/influencer/campaigns");
      return;
    }

    if (hasDeliveredContent && !isApproved) {
      navigate("/dashboard/influencer/messages", {
        state: {
          conversationId,
          campaignId,
          applicationId: application?.id,
          campaignName,
          peerName: companyName,
          peerRole: "company",
        },
      });
      return;
    }

    switch (status) {
      case "content_approved":
      case "approved_content":
      case "published":
      case "completed":
      case "complete":
        navigate("/dashboard/influencer/campaigns");
        break;
      case "accepted":
      case "accept":
      case "approved":
      case "modification_requested":
        setView("form");
        break;
      default:
        navigate("/dashboard/influencer/messages", {
          state: {
            conversationId,
            campaignId,
            applicationId: application?.id,
            campaignName,
            peerName: companyName,
            peerRole: "company",
          },
        });
    }
  };

  const actionLabel = (() => {
    if (isApproved) return "عرض الحملات المكتملة";

    switch (status) {
      case "content_approved":
      case "approved_content":
      case "published":
      case "completed":
      case "complete":
        return "عرض الحملات المكتملة";
      case "modification_requested":
        return "إعادة إرسال المحتوى";
      case "accepted":
      case "accept":
      case "approved":
        return hasDeliveredContent ? "فتح المحادثة" : "نشر المحتوى";
      default:
        return "فتح المحادثة";
    }
  })();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.mediaUrl.trim()) {
      toast.error("رابط المحتوى مطلوب");
      return;
    }

    submitContentMutation.mutate();
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-white">
      <div className="relative h-56 w-full overflow-hidden sm:h-80">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
        <h1 className="absolute bottom-5 right-5 border-b border-white pb-1 text-[12px] font-semibold text-white sm:bottom-8 sm:right-10 sm:text-lg">
          تفاصيل حملة
        </h1>
      </div>

      <div className="relative z-10 -mt-9 min-h-[430px] rounded-t-[28px] bg-white px-4 pb-20 pt-7 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-md sm:max-w-4xl">
          <div className="p-0 sm:p-6 lg:p-8">
            <div className="p-0 sm:p-6">
              {applicationsQuery.isLoading ||
              collaborationRequestsQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#9baa87] border-t-transparent" />
                </div>
              ) : !application ? (
                <div className="py-20 text-center text-sm text-[#7d8077]">
                  لا توجد حملة نشطة للمتابعة حاليا
                </div>
              ) : view === "form" ? (
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-md pb-8 pt-2">
                  <h1 className="mx-auto mb-10 w-fit border-b border-black pb-1 text-center text-[14px] font-bold text-[#252722] sm:text-base">
                    {t(
                      "influencerDashboard.publishForm.title",
                      "قم بنشر محتوى الحملة",
                    )}
                  </h1>

                  <div className="space-y-5">
                    <label className="block text-start text-[11px] font-bold text-[#3b3d37] sm:text-[12px]">
                      {t(
                        "influencerDashboard.publishForm.link",
                        "رابط المحتوى المنشور",
                      )}
                      <div className="relative mt-2">
                        <Input
                          value={form.mediaUrl}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              mediaUrl: event.target.value,
                            }))
                          }
                          placeholder=""
                          className="h-11 rounded-full border-[#d9d7d0] bg-white px-4 text-center text-[12px] shadow-none focus-visible:ring-1 focus-visible:ring-[#9baa87]"
                        />
                        {!form.mediaUrl && (
                          <Link2 className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-[#a3a694]" />
                        )}
                      </div>
                    </label>

                    <label className="block text-start text-[11px] font-bold text-[#3b3d37] sm:text-[12px]">
                      {t("influencerDashboard.publishForm.story", "ستوري")}
                      <div className="relative mt-2">
                        <Input
                          value={form.description}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              description: event.target.value,
                            }))
                          }
                          placeholder=""
                          className="h-11 rounded-full border-[#d9d7d0] bg-white px-4 text-center text-[12px] shadow-none focus-visible:ring-1 focus-visible:ring-[#9baa87]"
                        />
                        {!form.description && (
                          <ImageIcon className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-[#a3a694]" />
                        )}
                      </div>
                    </label>

                    <label className="block text-start text-[11px] font-bold text-[#3b3d37] sm:text-[12px]">
                      {t(
                        "influencerDashboard.publishForm.publishDate",
                        "تاريخ ووقت النشر",
                      )}
                      <div className="relative mt-2">
                        <Input
                          type="date"
                          value={form.publishDate}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              publishDate: event.target.value,
                            }))
                          }
                          dir={isRTL ? "rtl" : "ltr"}
                          className="h-11 w-full rounded-full border-[#d9d7d0] bg-white px-4 text-center text-[12px] shadow-none focus-visible:ring-1 focus-visible:ring-[#9baa87] [&::-webkit-calendar-picker-indicator]:opacity-50"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <Button
                      type="submit"
                      disabled={submitContentMutation.isPending}
                      className="h-10 min-w-40 rounded-full bg-[#9baa87] px-8 text-[12px] font-semibold text-white shadow-[0_10px_18px_rgba(130,143,108,0.22)] hover:bg-[#8d9d77] sm:min-w-48 sm:text-[13px]">
                      {submitContentMutation.isPending
                        ? t(
                            "influencerDashboard.publishForm.submitting",
                            "جاري الإرسال...",
                          )
                        : t(
                            "influencerDashboard.publishForm.submit",
                            "تأكيد النشر",
                          )}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between gap-2 px-1 pb-2 sm:mb-6 sm:border-b sm:border-[#f0eee8] sm:px-0 sm:pb-5 sm:pt-0">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex rounded-sm bg-[#b7c69b] px-2.5 py-1.5 text-[10px] font-medium text-white sm:rounded-md sm:text-[11px]">
                        {statusLabel}
                      </span>
                      <MessageCircleMore className="hidden h-4 w-4 text-[#979b90] sm:block" />
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#9b9f90] sm:text-sm">
                      <span>{date}</span>
                      <CalendarDays className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[0.82fr_1.18fr] gap-3 px-1 sm:grid-cols-1 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="text-right">
                      <div className="mb-2 flex flex-col items-end gap-1 sm:flex-row-reverse sm:items-center sm:justify-start">
                        <span
                          className={cn(
                            "rounded-sm px-3 py-1.5 text-[10px] font-medium text-white sm:self-auto sm:rounded-md sm:px-4 sm:text-[12px]",
                            isApproved ? "bg-[#39b54a]" : "bg-[#9baa87]",
                          )}>
                          {statusLabel}
                        </span>
                        <p className="text-[11px] leading-6 text-[#4f5049] sm:text-sm sm:leading-7">
                          <span className="font-semibold text-[#292924]">
                            اسم الحملة :
                          </span>{" "}
                          {campaignName}
                        </p>
                      </div>

                      <div className="space-y-2 text-[11px] leading-6 text-[#4f5049] sm:text-sm sm:leading-7">
                        <p>
                          <span className="font-semibold text-[#292924]">
                            اسم الشركة :
                          </span>{" "}
                          {companyName}
                        </p>
                        <div>
                          <p className="font-semibold text-[#292924]">
                            تفاصيل الدفع :
                          </p>
                          <ul className="mt-1 space-y-1">
                            <li>
                              <span className="font-semibold text-[#3f3f39]">
                                المبلغ المتفق عليه :
                              </span>{" "}
                              {amount}
                            </li>
                            <li>
                              <span className="font-semibold text-[#3f3f39]">
                                العمولة :
                              </span>{" "}
                              -
                            </li>
                            <li>
                              <span className="font-semibold text-[#3f3f39]">
                                صافي المؤثر :
                              </span>{" "}
                              {amount}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="order-first lg:order-0">
                      <div className="relative">
                        <div
                          className="absolute bottom-3 right-[7px] top-3 w-px bg-[#d9d5ea] sm:left-2 sm:right-auto"
                          aria-hidden="true"
                        />
                        <div className="relative block space-y-6 pb-2 sm:space-y-9">
                          {trackingSteps.map((step) => {
                            const completed = completedSteps >= step.id;

                            return (
                              <div
                                key={step.id}
                                className="relative flex flex-row-reverse items-center justify-end gap-2">
                                <div
                                  className={cn(
                                    "relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-white sm:h-5 sm:w-5",
                                    completed
                                      ? "bg-[#9baa87] sm:bg-[#8f8cb0]"
                                      : "bg-[#d8dccb] sm:bg-[#d9d5ea]",
                                  )}>
                                  {completed ? (
                                    <Check
                                      className="hidden h-3 w-3 sm:block"
                                      strokeWidth={3}
                                    />
                                  ) : (
                                    <Circle className="hidden h-3 w-3 sm:block" />
                                  )}
                                </div>
                                <p
                                  className={cn(
                                    "text-right text-[11px] font-medium sm:text-[15px]",
                                    completed
                                      ? "text-[#62665d]"
                                      : "text-[#a0a39a]",
                                  )}>
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      type="button"
                      onClick={handleAction}
                      className="h-8 min-w-36 rounded-full bg-white px-8 text-[11px] font-semibold text-[#60645b] ring-1 ring-[#dedbd2] hover:bg-[#f8f7f3]">
                      {actionLabel}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignPublish;
