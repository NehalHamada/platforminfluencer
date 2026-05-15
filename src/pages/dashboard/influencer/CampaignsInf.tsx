import { CalendarDays, Check, MessageCircleMore } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";
import { useCampaignsQuery } from "@/queries/campaigns/useCampaignsQuery";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { queryKeys } from "@/constants/queryKeys";
import { chatService } from "@/services/chat.service";
import { campaignService } from "@/services/campaign.service";
import type { Campaign } from "@/types/campaign.types";
import { getCompletedCampaignEntries } from "@/utils/completedCampaigns";
import {
  buildCompletedEntryFromConversation,
  getConversationCampaignId,
  hasContentApprovalMessage,
} from "@/utils/completedCampaignSource";
import { buildCompletedCampaignViews } from "@/utils/completedCampaignViews";

const getUniqueIds = (...values: Array<string | number | null | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );

const isCampaign = (value: Campaign | undefined): value is Campaign =>
  Boolean(value);

type CampaignStep = {
  id: number;
  label: string;
  completed: boolean;
};

function CampaignsInf() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { campaignId: campaignIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = campaignIdParam ?? searchParams.get("campaignId");
  const applicationsQuery = useCampaignRequestsQuery();
  const collaborationRequestsQuery = useCollaborationRequestsQuery();
  const campaignsQuery = useCampaignsQuery();
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
      conversationMessagesQueries.reduce<ReturnType<typeof getCompletedCampaignEntries>>(
        (entries, query, index) => {
          if (!hasContentApprovalMessage(query.data?.data)) return entries;
          const conversation = conversations.find(
            (item) => String(item.id) === String(conversationIds[index]),
          );
          if (!conversation) return entries;
          const entry = buildCompletedEntryFromConversation(
            conversation,
            query.data?.data,
          );
          if (
            campaignId &&
            String(entry.campaignId ?? getConversationCampaignId(conversation)) !==
              String(campaignId)
          ) {
            return entries;
          }
          entries.push(entry);
          return entries;
        },
        [],
      ),
    [campaignId, conversationIds, conversationMessagesQueries, conversations],
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
        ...(collaborationRequestsQuery.data?.data ?? []).map(
          (request) => request.campaign_id ?? request.campaign?.id,
        ),
        campaignId,
      ),
    [
      allCompletedEntries,
      applicationsQuery.data?.data,
      campaignId,
      collaborationRequestsQuery.data?.data,
      conversations,
    ],
  );
  const campaignDetailsQueries = useQueries({
    queries: detailCampaignIds.map((detailCampaignId) => ({
      queryKey: queryKeys.campaigns.details(detailCampaignId),
      queryFn: () => campaignService.getCampaignById(detailCampaignId),
      enabled: Boolean(detailCampaignId),
      staleTime: 30000,
      retry: 1,
    })),
  });
  const detailedCampaigns = campaignDetailsQueries
    .map((query) => query.data?.data)
    .filter(isCampaign);
  const completedItems = useMemo(
    () =>
      buildCompletedCampaignViews({
        role: "influencer",
        applications: applicationsQuery.data?.data,
        collaborationRequests: collaborationRequestsQuery.data?.data,
        campaigns: [...(campaignsQuery.data?.data ?? []), ...detailedCampaigns],
        entries: allCompletedEntries,
        conversations,
        campaignId,
        completedText: t(
          "campaign.contentApproved",
          "Content approved and campaign completed",
        ),
      }),
    [
      allCompletedEntries,
      applicationsQuery.data?.data,
      campaignId,
      campaignsQuery.data?.data,
      collaborationRequestsQuery.data?.data,
      conversations,
      detailedCampaigns,
      t,
    ],
  );

  const getSteps = (completedSteps: number): CampaignStep[] => [
    {
      id: 1,
      label: t("campaign.agreementDone"),
      completed: completedSteps >= 1,
    },
    {
      id: 2,
      label: t("campaign.contentApproved"),
      completed: completedSteps >= 2,
    },
    {
      id: 3,
      label: t("campaign.contentPosted"),
      completed: completedSteps >= 3,
    },
  ];

  const isLoading =
    applicationsQuery.isLoading ||
    collaborationRequestsQuery.isLoading ||
    conversationsQuery.isLoading ||
    campaignsQuery.isLoading;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-white">
      <div className="relative h-52 w-full overflow-hidden sm:h-85">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <h1
          className={`absolute bottom-5 block text-[11px] font-semibold text-white sm:hidden ${
            isRTL ? "right-4" : "left-4"
          }`}>
          تفاصيل حملتك
        </h1>
      </div>

      <div className="relative z-10 -mt-1 bg-white px-3 pb-24 pt-0 sm:-mt-10 sm:rounded-t-[34px] sm:bg-[#f7f6f2] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <div className="bg-white p-0 shadow-none sm:rounded-[28px] sm:p-6 sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)] lg:p-8">
            <div className="space-y-5 rounded-none bg-white p-0 sm:rounded-[22px] sm:bg-[#fbfaf7] sm:p-5 lg:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[rgba(111,66,193,0.5)] border-t-transparent" />
                </div>
              ) : null}

              {!isLoading && !completedItems.length ? (
                <div className="py-16 text-center text-sm text-[#8b8b8b]">
                  {t("campaign.empty", "No campaign data available")}
                </div>
              ) : null}

              {completedItems.map((campaign) => {
                const steps = getSteps(campaign.completedSteps);
                const paymentSummary = campaign.paymentSummary;

                return (
                  <div
                    key={campaign.key}
                    className="rounded-none bg-white p-0 sm:rounded-[22px] sm:bg-[#fbfaf7] sm:p-5 lg:p-6">
                    <div
                      className={`mb-4 flex flex-row-reverse items-center justify-between gap-2 border-b border-[#f0eee8] px-1 py-3 sm:mb-5 sm:gap-3 sm:border-[#eceae2] sm:px-0 sm:pb-4 sm:pt-0 sm:flex-row sm:items-center sm:justify-between ${
                        isRTL ? "sm:flex-row-reverse" : "sm:flex-row-reverse"
                      }`}>
                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 ${
                          isRTL ? "flex-row-reverse" : "flex-row-reverse"
                        }`}>
                        <span className="inline-flex rounded-sm bg-[rgba(111,66,193,1)] px-3 py-1.5 text-[11px] font-medium text-white sm:rounded-md sm:bg-[#262626] sm:px-3 sm:py-1.5 sm:text-xs">
                          {t("campaign.chatAvailable")}
                        </span>
                        <MessageCircleMore className="hidden h-3 w-3 text-[#979b90] sm:block sm:h-4 sm:w-4" />
                      </div>

                      <div
                        className={`flex items-center gap-1.5 text-[11px] text-[#6e7267] sm:gap-2 sm:text-sm ${
                          isRTL ? "flex-row-reverse" : "flex-row-reverse"
                        }`}>
                        <CalendarDays className="h-4 w-4 sm:h-4 sm:w-4" />
                        <span>{campaign.date}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 px-1 sm:gap-8 sm:px-0 lg:grid-cols-[0.85fr_1.15fr]">
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <div
                          className={`mb-3 flex flex-col items-start gap-1 sm:mb-5 sm:flex-row sm:items-center sm:gap-3 ${
                            isRTL
                              ? "sm:flex-row-reverse sm:justify-end"
                              : "sm:flex-row-reverse sm:justify-end"
                          }`}>
                          <span className="order-2 self-center inline-flex rounded-sm bg-[rgba(111,66,193,1)] px-4 py-1.5 text-[12px] font-medium text-white sm:order-0 sm:self-auto sm:rounded-md sm:px-4 sm:py-1.5 sm:text-sm">
                            {t("campaign.campaignCompleted")}
                          </span>
                          <p className="text-sm leading-7 text-[#4f5049] sm:text-[15px] sm:leading-7">
                            <span className="font-semibold text-[#292924]">
                              {t("campaign.campaignName")} :
                            </span>{" "}
                            {campaign.title}
                          </p>
                        </div>

                        <div className="space-y-3 text-sm leading-7 text-[#4f5049] sm:space-y-3 sm:text-[15px] sm:leading-7">
                          <p>
                            <span className="font-semibold text-[#292924]">
                              {t("campaign.companyName")} :
                            </span>{" "}
                            {campaign.companyName}
                          </p>
                          <div>
                            <p className="font-semibold text-[#292924]">
                              {t("campaign.paymentDetails")} :
                            </p>
                            <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1">
                              {paymentSummary.paymentMethod ? (
                                <li>
                                  <span className="font-semibold text-[#3f3f39]">
                                    {t("sureCampaign.paymentOption", "طريقة الدفع")} :
                                  </span>{" "}
                                  {paymentSummary.paymentMethod}
                                </li>
                              ) : null}
                              {paymentSummary.postsCount ? (
                                <li>
                                  <span className="font-semibold text-[#3f3f39]">
                                    {t("campaignPayment.postsCount", "عدد المنشورات")} :
                                  </span>{" "}
                                  {paymentSummary.postsCount}
                                </li>
                              ) : null}
                              {paymentSummary.executionDate ? (
                                <li>
                                  <span className="font-semibold text-[#3f3f39]">
                                    {t("campaignPayment.executionDate", "موعد التنفيذ")} :
                                  </span>{" "}
                                  {paymentSummary.executionDate}
                                </li>
                              ) : null}
                              <li>
                                <span className="font-semibold text-[#3f3f39]">
                                  {t("campaign.reservedAmount")} :
                                </span>{" "}
                                {paymentSummary.totalAmount}
                              </li>
                              <li>
                                <span className="font-semibold text-[#3f3f39]">
                                  {t("campaign.commission")} :
                                </span>{" "}
                                {paymentSummary.commission}
                              </li>
                              <li>
                                <span className="font-semibold text-[#3f3f39]">
                                  {t("campaign.influencerNet")} :
                                </span>{" "}
                                {paymentSummary.influencerNet}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="order-first relative sm:order-0 lg:pt-1">
                        <div
                          className={`hidden sm:absolute sm:top-3 sm:bottom-3 sm:block sm:w-px sm:h-30 sm:bg-[#dbd7ec] ${
                            isRTL ? "left-2" : "right-2"
                          }`}
                        />
                        <div className="relative flex items-start justify-between gap-2 pb-2 sm:block sm:space-y-10">
                          <div
                            className="absolute left-5 right-5 top-1 h-px bg-[#d8dccb] sm:hidden"
                            aria-hidden="true"
                          />
                          {steps.map((step) => (
                            <div
                              key={step.id}
                              className={`relative flex flex-1 flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 ${
                                isRTL ? "sm:flex-row-reverse" : "sm:flex-row-reverse"
                              }`}>
                              <div
                                className={`relative z-10 flex h-2 w-2 shrink-0 items-center justify-center rounded-full text-white sm:h-4 sm:w-4 ${
                                  step.completed
                                    ? "bg-[rgba(111,66,193,0.5)] sm:bg-[rgba(111,66,193,1)]"
                                    : "bg-[rgba(111,66,193,0.15)] sm:bg-[rgba(111,66,193,0.2)]"
                                }`}>
                                {step.completed ? (
                                  <Check
                                    className="hidden h-2.5 w-2.5 sm:block"
                                    strokeWidth={3}
                                  />
                                ) : null}
                              </div>
                              <p
                                className={`text-center text-[11px] font-medium ${
                                  step.completed ? "text-[#62665d]" : "text-[#a0a39a]"
                                } sm:text-[15px] ${
                                  isRTL ? "sm:text-left" : "sm:text-left"
                                }`}>
                                {step.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-full bg-[rgba(111,66,193,0.06)] px-4 py-2.5 text-center text-xs leading-5 text-[#595c55] sm:mt-8 sm:rounded-[12px] sm:px-4 sm:py-4 sm:text-sm">
                      {campaign.completedText}
                    </div>

                    <div className="mt-5 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!campaign.contentUrl}
                        onClick={() => {
                          if (campaign.contentUrl) {
                            window.open(
                              campaign.contentUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }}
                        className="h-10 rounded-full border-[#d7d4ca] bg-white px-7 text-xs font-semibold text-[#6f6d66] hover:bg-[#faf9f5]">
                        {t("campaigns.viewContent", "View content")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignsInf;
