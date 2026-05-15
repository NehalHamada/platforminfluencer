import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MessageCircleMore,
  Send,
  Star,
  X,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueries } from "@tanstack/react-query";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAllCampaignApplicationsQuery } from "@/queries/campaigns/useAllCampaignApplicationsQuery";
import { useCampaignsQuery } from "@/queries/campaigns/useCampaignsQuery";
import { useCompanyCollaborationRequestsQuery } from "@/queries/campaigns/useCompanyCollaborationRequestsQuery";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { queryKeys } from "@/constants/queryKeys";
import { chatService } from "@/services/chat.service";
import { campaignService } from "@/services/campaign.service";
import type { Campaign, CampaignStep } from "@/types/campaign.types";
import { getCompletedCampaignEntries } from "@/utils/completedCampaigns";
import {
  buildCompletedEntryFromConversation,
  hasContentApprovalMessage,
} from "@/utils/completedCampaignSource";
import {
  buildCompletedCampaignViews,
  type CompletedCampaignView,
} from "@/utils/completedCampaignViews";
import {
  saveInfluencerReview,
  type InfluencerReviewInput,
} from "@/utils/influencerReviews";
import { saveCompletedCampaignEntry } from "@/utils/completedCampaigns";

const getUniqueIds = (...values: Array<string | number | null | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(
          (value) =>
            value &&
            value !== "-" &&
            value !== "—" &&
            value.toLowerCase() !== "undefined" &&
            value.toLowerCase() !== "null",
        ),
    ),
  );

const isCampaign = (value: Campaign | undefined): value is Campaign =>
  Boolean(value);

const normalizeDisplayText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getCompletedItemKey = (item: CompletedCampaignView) => {
  const applicationId = normalizeDisplayText(item.applicationId);
  const conversationId = normalizeDisplayText(item.conversationId);
  const campaignId = normalizeDisplayText(item.campaignId);
  const title = normalizeDisplayText(item.title);
  const influencer =
    normalizeDisplayText(item.influencerId) ||
    normalizeDisplayText(item.influencerName);

  if ((campaignId || title) && influencer) {
    return `campaign:${campaignId || title}:influencer:${influencer}`;
  }

  if (applicationId) return `application:${applicationId}`;
  if (conversationId) return `conversation:${conversationId}`;

  return `campaign:${campaignId || title}`;
};

const mergeCompletedItem = (
  current: CompletedCampaignView,
  next: CompletedCampaignView,
): CompletedCampaignView => ({
  ...current,
  ...next,
  key: current.key,
  id: next.id || current.id,
  campaignId: next.campaignId ?? current.campaignId,
  applicationId: next.applicationId ?? current.applicationId,
  conversationId: next.conversationId ?? current.conversationId,
  influencerId: next.influencerId ?? current.influencerId,
  title: next.title || current.title,
  companyName: next.companyName || current.companyName,
  influencerName: next.influencerName || current.influencerName,
  contentUrl: next.contentUrl ?? current.contentUrl,
  review: next.review ?? current.review,
  paymentSummary: next.paymentSummary ?? current.paymentSummary,
  completedSteps: Math.max(current.completedSteps, next.completedSteps),
  date:
    String(next.date).localeCompare(String(current.date)) > 0
      ? next.date
      : current.date,
});

const dedupeCompletedItems = (items: CompletedCampaignView[]) =>
  items.reduce<CompletedCampaignView[]>((acc, item) => {
    const key = getCompletedItemKey(item);
    const existingIndex = acc.findIndex(
      (current) => getCompletedItemKey(current) === key,
    );

    if (existingIndex >= 0) {
      acc[existingIndex] = mergeCompletedItem(acc[existingIndex], item);
    } else {
      acc.push(item);
    }

    return acc;
  }, []);

function ReviewStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#f1f3ec]">
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
  );
}

function CampaignReviewPopup({
  item,
  isRTL,
  onClose,
  onSubmit,
}: {
  item: CompletedCampaignView | null;
  isRTL: boolean;
  onClose: () => void;
  onSubmit: (review: InfluencerReviewInput) => void;
}) {
  const { t } = useTranslation();
  const [scheduleCommitment, setScheduleCommitment] = useState(0);
  const [contentQuality, setContentQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!scheduleCommitment || !contentQuality || !communication) {
      setError(
        isRTL ? "من فضلك أكمل كل التقييمات" : "Please complete all ratings",
      );
      return;
    }

    onSubmit({
      campaignId: item.campaignId ?? item.id,
      applicationId: item.applicationId,
      conversationId: item.conversationId,
      influencerId: item.influencerId,
      campaignName: item.title,
      influencerName: item.influencerName,
      scheduleCommitment,
      contentQuality,
      communication,
      comment: comment.trim(),
    });
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
        className="relative w-full max-w-126 overflow-hidden rounded-[22px] bg-[#f7f7f6] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
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

        <div className="px-6 pb-6 pt-7 sm:px-10">
          <h2 className="mx-auto mb-5 w-fit border-b border-[#20231f] pb-1 text-center text-[13px] font-semibold text-[#22271f]">
            {isRTL ? "قيّم المؤثر" : "Rate influencer"}
          </h2>

          <p className="mb-5 text-center text-xs font-medium text-[#62645d]">
            {item.influencerName} • {item.title}
          </p>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-center text-[11px] font-medium text-[#34342f]">
                {isRTL ? "الالتزام بالمواعيد" : "Schedule commitment"}
              </p>
              <ReviewStars
                value={scheduleCommitment}
                onChange={setScheduleCommitment}
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-center text-[11px] font-medium text-[#34342f]">
                {isRTL ? "تعليق" : "Comment"}
              </span>
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={
                  isRTL
                    ? "اكتب ملاحظتك عن تجربة التعاون"
                    : "Write your collaboration feedback"
                }
                className="h-8 w-full rounded-full border border-[#dedbd2] bg-white px-4 text-center text-[10px] text-[#34342f] outline-none placeholder:text-[#8d887e] focus:border-[rgba(111,66,193,0.5)] sm:text-[11px]"
              />
            </label>

            <div>
              <p className="mb-2 text-center text-[11px] font-medium text-[#34342f]">
                {isRTL ? "جودة المحتوى" : "Content quality"}
              </p>
              <ReviewStars
                value={contentQuality}
                onChange={setContentQuality}
              />
            </div>

            <div>
              <p className="mb-2 text-center text-[11px] font-medium text-[#34342f]">
                {isRTL ? "سهولة التواصل" : "Communication"}
              </p>
              <ReviewStars value={communication} onChange={setCommunication} />
            </div>
          </div>

          {error ? (
            <p className="mt-3 text-center text-xs font-medium text-[#c85353]">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex justify-center">
            <Button
              type="submit"
              className={cn(
                "h-9 min-w-42 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-5 text-[10px] font-semibold text-white hover:opacity-90 sm:text-[11px]",
                isRTL ? "flex-row" : "flex-row-reverse",
              )}>
              <Send className="h-3.5 w-3.5" />
              {isRTL ? "إرسال التقييم" : "Send review"}
            </Button>
          </div>
        </div>

        <div className="bg-[rgba(26,20,37,1)] px-6 py-5 text-center text-white">
          <p className="text-[11px] font-semibold">GROWTH</p>
          <p className="mx-auto mt-2 max-w-82 text-[10px] leading-5 text-white/90">
            {isRTL
              ? "منصة تربط بين الشركات والمؤثرين عبر تعاونات منظمة وشفافة"
              : "Organized, transparent collaborations built on real results"}
          </p>
        </div>
      </form>
    </div>
  );
}

function Campaigns() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [reviewItem, setReviewItem] = useState<CompletedCampaignView | null>(
    null,
  );
  const [, setReviewVersion] = useState(0);
  const campaignsQuery = useCampaignsQuery();
  const applicationsQuery = useAllCampaignApplicationsQuery();
  const companyRequestsQuery = useCompanyCollaborationRequestsQuery();
  const conversationsQuery = useConversationsQuery();
  const conversations = conversationsQuery.data?.data ?? [];
  const conversationIds = useMemo(
    () => conversations.map((conversation) => conversation.id).filter(Boolean),
    [conversations],
  );
  const conversationMessagesQueries = useQueries({
    queries: conversationIds.map((conversationId) => ({
      queryKey: queryKeys.chat.messages(conversationId),
      queryFn: () => chatService.getMessages(conversationId),
      enabled: Boolean(conversationId),
      staleTime: 30000,
    })),
  });
  const completedConversationEntries = useMemo(
    () =>
      conversationMessagesQueries.reduce<
        ReturnType<typeof getCompletedCampaignEntries>
      >((entries, query, index) => {
        if (!hasContentApprovalMessage(query.data?.data)) return entries;
        const conversation = conversations.find(
          (item) => String(item.id) === String(conversationIds[index]),
        );
        if (conversation) {
          entries.push(
            buildCompletedEntryFromConversation(conversation, query.data?.data),
          );
        }
        return entries;
      }, []),
    [conversationIds, conversationMessagesQueries, conversations],
  );
  const allCompletedEntries = [
    ...completedConversationEntries,
    ...getCompletedCampaignEntries(),
  ];
  const detailCampaignIds = useMemo(
    () =>
      getUniqueIds(
        ...allCompletedEntries.map((entry) => entry.campaignId),
        ...conversations.map(
          (conversation) => conversation.campaign_id ?? conversation.campaignId,
        ),
        ...(applicationsQuery.data?.data ?? []).map(
          (application) => application.campaign_id ?? application.campaign?.id,
        ),
        ...(companyRequestsQuery.data?.data ?? []).map(
          (request) => request.campaign_id ?? request.campaign?.id,
        ),
      ),
    [
      allCompletedEntries,
      applicationsQuery.data?.data,
      companyRequestsQuery.data?.data,
      conversations,
    ],
  );
  const campaignDetailsQueries = useQueries({
    queries: detailCampaignIds.map((campaignId) => ({
      queryKey: queryKeys.campaigns.details(campaignId),
      queryFn: () => campaignService.getCampaignById(campaignId),
      enabled: Boolean(campaignId),
      staleTime: 30000,
      retry: 1,
    })),
  });
  const detailedCampaigns = campaignDetailsQueries
    .map((query) => query.data?.data)
    .filter(isCampaign);
  const completedItems = useMemo(
    () =>
      dedupeCompletedItems(
        buildCompletedCampaignViews({
          role: "company",
          applications: applicationsQuery.data?.data,
          collaborationRequests: companyRequestsQuery.data?.data,
          campaigns: [
            ...(campaignsQuery.data?.data ?? []),
            ...detailedCampaigns,
          ],
          entries: allCompletedEntries,
          conversations,
          completedText: t(
            "campaign.contentApproved",
            "Content approved and campaign completed",
          ),
        }),
      ),
    [
      allCompletedEntries,
      applicationsQuery.data?.data,
      campaignsQuery.data?.data,
      companyRequestsQuery.data?.data,
      conversations,
      detailedCampaigns,
      t,
    ],
  );

  const getSteps = (completedSteps: number): CampaignStep[] => [
    {
      id: 1,
      label: isRTL ? "تم الاتفاق" : "Agreement completed",
      completed: completedSteps >= 1,
    },
    {
      id: 2,
      label: isRTL ? "الموافقة على المحتوى" : "Content approved",
      completed: completedSteps >= 2,
    },
    {
      id: 3,
      label: isRTL ? "تم نشر المحتوى" : "Content published",
      completed: completedSteps >= 3,
    },
  ];

  const isLoading =
    campaignsQuery.isLoading ||
    applicationsQuery.isLoading ||
    companyRequestsQuery.isLoading ||
    conversationsQuery.isLoading;

  const handleReviewSubmit = (review: InfluencerReviewInput) => {
    saveInfluencerReview(review);

    saveCompletedCampaignEntry({
      applicationId: review.applicationId ?? reviewItem?.applicationId,
      conversationId: review.conversationId ?? reviewItem?.conversationId,
      campaignId: review.campaignId ?? reviewItem?.campaignId ?? reviewItem?.id,
      campaignName: review.campaignName ?? reviewItem?.title,
      influencerName: review.influencerName ?? reviewItem?.influencerName,
      influencerId: review.influencerId ?? reviewItem?.influencerId,
      mediaUrl: reviewItem?.contentUrl,
      amount: reviewItem?.paymentSummary.totalAmount,
      companyName: reviewItem?.companyName,
      status: "content_approved",
      date: reviewItem?.date ?? new Date().toISOString(),
    });

    setReviewItem(null);
    setReviewVersion((value) => value + 1);
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[rgba(255,255,255,1)]">
      <div className="relative h-52 w-full overflow-hidden sm:h-80">
        <img
          src={hero}
          alt={t("campaigns.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1
          className={cn(
            "absolute bottom-5 block text-[11px] font-semibold text-white sm:hidden",
            isRTL ? "right-4" : "left-4",
          )}>
          {t("campaigns.pageTitle")}
        </h1>
      </div>

      <div className="relative z-10 -mt-1 bg-[rgba(255,255,255,1)] px-3 pb-24 pt-0 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <div className="border0 bg-white py-0 shadow-none sm:rounded-[28px] sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="p-0 sm:p-6 lg:p-8">
              {isLoading ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-[#6a6a63]">
                  {t("campaigns.loading")}
                </div>
              ) : null}

              {campaignsQuery.isError && !completedItems.length ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-destructive">
                  {t("campaigns.error")}
                </div>
              ) : null}

              {!isLoading &&
              !campaignsQuery.isError &&
              !completedItems.length ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-[#6a6a63]">
                  {t("campaigns.empty")}
                </div>
              ) : null}

              <div className="space-y-5">
                {completedItems.map((item) => {
                  const steps = getSteps(item.completedSteps);
                  const paymentSummary = item.paymentSummary;

                  return (
                    <div
                      key={item.key}
                      className="rounded-none bg-[rgba(255,255,255,1)] p-0 sm:rounded-[22px] sm:p-5 lg:p-6">
                      <div
                        className={cn(
                          "mb-4 flex flex-row-reverse items-center justify-between gap-2 border-b border-[#f0eee8] px-1 py-3 sm:mb-5 sm:flex-row sm:gap-3 sm:border-[rgba(255,255,255,1)] sm:px-0 sm:pb-4 sm:pt-0 sm:items-center sm:justify-between",
                          isRTL ? "sm:flex-row-reverse" : "sm:flex-row",
                        )}>
                        <div
                          className={cn(
                            "flex items-center gap-1.5 sm:gap-2",
                            isRTL ? "flex-row-reverse" : "flex-row",
                          )}>
                          <Badge className="rounded-sm bg-[rgba(111,66,193,1)] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[rgba(111,66,193,1)] sm:rounded-md sm:px-3 sm:py-1.5 sm:text-xs">
                            {t("campaigns.openChat")}
                          </Badge>
                          <MessageCircleMore className="hidden h-3 w-3 text-[rgba(111,66,193,0.7)] sm:block sm:h-4 sm:w-4" />
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-1.5 text-[11px] text-[#98a085] sm:gap-2 sm:text-sm",
                            isRTL ? "flex-row" : "flex-row",
                          )}>
                          <CalendarDays className="h-4 w-4 sm:h-4 sm:w-4" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 px-1 sm:gap-8 sm:px-0 lg:grid-cols-[0.95fr_1.05fr]">
                        <div>
                          <div
                            className={cn(
                              "space-y-3 text-sm leading-7 text-[#4f5049] sm:space-y-4 sm:text-[15px] sm:leading-7",
                              isRTL ? "text-right" : "text-left",
                            )}>
                            <div>
                              <p className="font-semibold text-[#2b2b26]">
                                {t("campaigns.campaignName")} :
                              </p>
                              <div className="mt-1 flex flex-col items-start gap-1 sm:mt-2 sm:flex-row sm:flex-wrap sm:gap-2">
                                <span>{item.title}</span>
                                <Badge className="self-center rounded-sm bg-[#39b54a] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#39b54a] sm:self-auto sm:rounded-md sm:px-4 sm:py-1.5 sm:text-sm">
                                  {t("campaigns.success")}
                                </Badge>
                              </div>
                            </div>

                            <p>
                              <span className="font-semibold text-[#2b2b26]">
                                {t("campaigns.influencerName")} :
                              </span>{" "}
                              {item.influencerName}
                            </p>

                            <div>
                              <p className="font-semibold text-[#2b2b26]">
                                {t("campaigns.paymentDetails")} :
                              </p>
                              <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1">
                                {paymentSummary.paymentMethod ? (
                                  <li>
                                    <span className="font-semibold text-[#4a4a45]">
                                      {t(
                                        "sureCampaign.paymentOption",
                                        "طريقة الدفع",
                                      )}{" "}
                                      :
                                    </span>{" "}
                                    {paymentSummary.paymentMethod}
                                  </li>
                                ) : null}
                                {paymentSummary.postsCount ? (
                                  <li>
                                    <span className="font-semibold text-[#4a4a45]">
                                      {t(
                                        "campaignPayment.postsCount",
                                        "عدد المنشورات",
                                      )}{" "}
                                      :
                                    </span>{" "}
                                    {paymentSummary.postsCount}
                                  </li>
                                ) : null}
                                {paymentSummary.executionDate ? (
                                  <li>
                                    <span className="font-semibold text-[#4a4a45]">
                                      {t(
                                        "campaignPayment.executionDate",
                                        "موعد التنفيذ",
                                      )}{" "}
                                      :
                                    </span>{" "}
                                    {paymentSummary.executionDate}
                                  </li>
                                ) : null}
                                <li>
                                  <span className="font-semibold text-[#4a4a45]">
                                    {t("campaigns.totalAmount")} :
                                  </span>{" "}
                                  {paymentSummary.totalAmount}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#4a4a45]">
                                    {t("campaigns.commission")} :
                                  </span>{" "}
                                  {paymentSummary.commission}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#4a4a45]">
                                    {t("campaigns.netAmount")} :
                                  </span>{" "}
                                  {paymentSummary.influencerNet}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="order-first sm:order-0">
                          <div className="relative lg:pt-2">
                            <div
                              className={cn(
                                "hidden sm:absolute sm:bottom-3 sm:top-3 sm:block sm:w-px sm:bg-[#d9d5ea]",
                                isRTL ? "left-2" : "right-2",
                              )}
                              aria-hidden="true"
                            />

                            <div className="relative flex items-start justify-between gap-2 pb-2 sm:block sm:space-y-8">
                              <div
                                className="absolute left-5 right-5 top-1 h-px bg-[#d8dccb] sm:hidden"
                                aria-hidden="true"
                              />
                              {steps.map((step) => (
                                <div
                                  key={step.id}
                                  className={cn(
                                    "relative flex flex-1 flex-col items-center gap-1 sm:flex-row sm:gap-4",
                                    isRTL
                                      ? "sm:flex-row-reverse"
                                      : "sm:flex-row-reverse",
                                  )}>
                                  <div className="relative z-10 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[rgba(111,66,193,0.5)] text-white sm:h-5 sm:w-5 sm:bg-[rgba(111,66,193,1)]">
                                    {step.completed ? (
                                      <Check
                                        className="hidden h-3 w-3 sm:block"
                                        strokeWidth={3}
                                      />
                                    ) : null}
                                  </div>

                                  <p
                                    className={cn(
                                      "text-center text-[11px] font-medium text-[#62665d] sm:text-[15px]",
                                      isRTL ? "sm:text-right" : "sm:text-left",
                                    )}>
                                    {step.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center sm:mt-8">
                        <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                          <Button
                            type="button"
                            onClick={() => setReviewItem(item)}
                            className="h-9 rounded-sm bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] text-xs font-medium text-white hover:opacity-90 sm:h-12 sm:rounded-md sm:text-sm">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            {isRTL ? "تقييم المؤثر" : "Rate influencer"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              if (item.contentUrl) {
                                window.open(
                                  item.contentUrl,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }
                            }}
                            disabled={!item.contentUrl}
                            variant="outline"
                            className="h-9 rounded-sm border border-dashed border-[#d5d2c8] bg-white text-xs font-medium text-[#6a6a63] hover:bg-[#f8f7f3] sm:h-12 sm:rounded-md sm:text-sm">
                            {t("campaigns.viewContent")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-3 sm:pt-8">
                <Button
                  type="button"
                  className="group h-9 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-4 text-xs font-medium text-white shadow-[0_0_20px_rgba(111,66,193,0.25)] hover:opacity-90 sm:h-14 sm:px-6 sm:text-sm">
                  <span className={isRTL ? "text-right" : "text-left"}>
                    {t("campaigns.relaunch")}
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white sm:h-8 sm:w-8">
                    {isRTL ? (
                      <ArrowLeft className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                    ) : (
                      <ArrowRight className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                    )}
                  </span>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
      <CampaignReviewPopup
        item={reviewItem}
        isRTL={isRTL}
        onClose={() => setReviewItem(null)}
        onSubmit={handleReviewSubmit}
      />
    </section>
  );
}

export default Campaigns;
