import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueries, useQueryClient } from "@tanstack/react-query";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApplyCampaignMutation } from "@/queries/campaigns/useApplyCampaignMutation";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";
import { useRespondToCollaborationRequestMutation } from "@/queries/campaigns/useRespondToCollaborationRequestMutation";
import { useUpdateApplicationStatusMutation } from "@/queries/campaigns/useUpdateApplicationStatusMutation";
import { useCampaignStore } from "@/store/campaign.store";
import { queryKeys } from "@/constants/queryKeys";
import { useInfluencerDashboardQuery } from "@/queries/dashboard/useInfluencerDashboardQuery";
import { useConversationsQuery } from "@/queries/chat/useConversationsQuery";
import { chatService } from "@/services/chat.service";
import type { Campaign } from "@/types/campaign.types";
import { getConversationIdFromResponse } from "@/utils/apiResponse";
import { resolveAcceptedConversationId } from "@/utils/chat";
import { isClosedCampaignStatus } from "@/utils/campaignProgress";
import {
  getCompletedCampaignEntries,
  saveCompletedCampaignEntry,
} from "@/utils/completedCampaigns";

type CooperationItem = {
  id: string;
  campaign: Campaign;
  companyName: string;
  requestId?: string | number;
  applicationId?: string | number;
  source: "campaign" | "collaboration-request" | "my-application";
  status: string;
  executionDate?: string;
  price?: string | number;
  conversationId?: string | number;
};

const isAcceptedStatus = (status?: string) =>
  String(status ?? "").toLowerCase() === "accepted";

const isApprovedMessage = (message: unknown) => {
  if (!message || typeof message !== "object") return false;
  const value = message as Record<string, unknown>;

  return (
    String(value.type ?? "") === "content_approved" ||
    String(value.message ?? "").indexOf("__content_approved__") === 0
  );
};

const normalizeText = (value?: string | number | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getNestedRecord = (value: unknown, key: string) => getRecord(getRecord(value)[key]);

const getAnyText = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

const getAnyId = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

const getCampaignName = (campaign?: Campaign | null) => {
  const raw = getRecord(campaign);

  return getAnyText(
    campaign?.name,
    campaign?.campaign_type?.name,
    campaign?.campaignType?.name,
    campaign?.campaign_type_name,
    raw.title,
    raw.idea,
  );
};

const getConversationApplicationId = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const application = getNestedRecord(conversation, "application");

  return getAnyId(
    raw.application_id,
    raw.applicationId,
    application.id,
    raw.campaign_application_id,
    raw.campaignApplicationId,
  );
};

const getConversationCampaignId = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");

  return getAnyId(raw.campaign_id, raw.campaignId, campaign.id);
};

const getConversationCampaignName = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const campaign = getNestedRecord(conversation, "campaign");

  return getAnyText(
    raw.campaign_name,
    raw.campaignName,
    campaign.name,
    campaign.title,
    campaign.idea,
  );
};

const getConversationCompanyName = (conversation: unknown) => {
  const raw = getRecord(conversation);
  const company = getNestedRecord(conversation, "company");
  const campaign = getNestedRecord(conversation, "campaign");
  const campaignUser = getNestedRecord(campaign, "user");

  return getAnyText(
    raw.company_name,
    raw.companyName,
    company.company_name,
    company.name,
    campaign.company_name,
    campaignUser.company_name,
    campaignUser.name,
  );
};

const isCompletedByIdentity = ({
  applicationId,
  campaignId,
  conversationId,
  campaignName,
  companyName,
}: {
  applicationId?: string | number | null;
  campaignId?: string | number | null;
  conversationId?: string | number | null;
  campaignName?: string | null;
  companyName?: string | null;
}) => {
  const entries = getCompletedCampaignEntries();
  const appId = normalizeText(applicationId);
  const campId = normalizeText(campaignId);
  const convId = normalizeText(conversationId);
  const campName = normalizeText(campaignName);
  const company = normalizeText(companyName);

  return entries.some((entry) => {
    if (appId && normalizeText(entry.applicationId) === appId) return true;
    if (campId && normalizeText(entry.campaignId) === campId) return true;
    if (convId && normalizeText(entry.conversationId) === convId) return true;

    const sameCampaignName =
      campName && normalizeText(entry.campaignName) === campName;
    const sameCompany =
      company &&
      (normalizeText(entry.companyName) === company ||
        normalizeText(entry.influencerName) === company);

    return Boolean(
      sameCampaignName && (!company || !entry.companyName || sameCompany),
    );
  });
};

function Cooperation() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ─── Data sources ───
  const influencerDashboardQuery = useInfluencerDashboardQuery();
  const respondMutation = useRespondToCollaborationRequestMutation();
  const collabRequestsQuery = useCollaborationRequestsQuery();
  const myApplicationsQuery = useCampaignRequestsQuery();
  const conversationsQuery = useConversationsQuery();

  const applyCampaignMutation = useApplyCampaignMutation();
  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [acceptingItemId, setAcceptingItemId] = useState<string | null>(null);

  const { rejectedCampaignIds, addRejectedCampaignId } = useCampaignStore();
  const cooperationConversationIds = useMemo(() => {
    const ids = new Set<string>();
    const targets = [
      ...(collabRequestsQuery.data?.data ?? []).map((request) => ({
        applicationId: normalizeText(request.id),
        campaignId: normalizeText(request.campaign_id ?? request.campaign?.id),
        campaignName: normalizeText(getCampaignName(request.campaign)),
        companyName: normalizeText(
          request.company?.company_name ??
            request.company?.name ??
            request.campaign?.user?.company_name ??
            request.campaign?.user?.name,
        ),
      })),
      ...(myApplicationsQuery.data?.data ?? []).map((application) => ({
        applicationId: normalizeText(application.id),
        campaignId: normalizeText(
          application.campaign_id ?? application.campaign?.id,
        ),
        campaignName: normalizeText(getCampaignName(application.campaign)),
        companyName: normalizeText(
          application.campaign?.user?.company_name ??
            application.campaign?.user?.name ??
            application.campaign?.company_name,
        ),
      })),
    ];

    for (const request of collabRequestsQuery.data?.data ?? []) {
      if (request.conversation_id) ids.add(String(request.conversation_id));
      const responseConversationId = getConversationIdFromResponse(request);
      if (responseConversationId) ids.add(String(responseConversationId));
    }

    for (const application of myApplicationsQuery.data?.data ?? []) {
      if (application.conversation_id) {
        ids.add(String(application.conversation_id));
      }
      const responseConversationId = getConversationIdFromResponse(application);
      if (responseConversationId) ids.add(String(responseConversationId));
    }

    for (const conversation of conversationsQuery.data?.data ?? []) {
      const conversationApplicationId = normalizeText(
        getConversationApplicationId(conversation),
      );
      const conversationCampaignId = normalizeText(
        getConversationCampaignId(conversation),
      );
      const conversationCampaignName = normalizeText(
        getConversationCampaignName(conversation),
      );
      const conversationCompanyName = normalizeText(
        getConversationCompanyName(conversation),
      );

      const matched = targets.some((target) => {
        if (
          target.applicationId &&
          conversationApplicationId === target.applicationId
        ) {
          return true;
        }

        if (target.campaignId && conversationCampaignId === target.campaignId) {
          return true;
        }

        return Boolean(
          target.campaignName &&
            conversationCampaignName === target.campaignName &&
            (!target.companyName ||
              !conversationCompanyName ||
              conversationCompanyName === target.companyName),
        );
      });

      if (matched && conversation.id) ids.add(String(conversation.id));
    }

    return Array.from(ids);
  }, [
    collabRequestsQuery.data?.data,
    conversationsQuery.data?.data,
    myApplicationsQuery.data?.data,
  ]);

  const conversationMessagesQueries = useQueries({
    queries: cooperationConversationIds.map((conversationId) => ({
      queryKey: queryKeys.chat.messages(conversationId),
      queryFn: () => chatService.getMessages(conversationId),
      enabled: Boolean(conversationId),
      staleTime: 30000,
    })),
  });

  const approvedConversationIds = useMemo(() => {
    const ids = new Set<string>();

    conversationMessagesQueries.forEach((query, index) => {
      const hasApproval = query.data?.data?.some(isApprovedMessage);
      if (!hasApproval) return;

      ids.add(cooperationConversationIds[index]);
    });

    return ids;
  }, [conversationMessagesQueries, cooperationConversationIds]);

  const approvedConversationMatches = useMemo(() => {
    const matches = {
      applicationIds: new Set<string>(),
      campaignIds: new Set<string>(),
      campaignNames: new Set<string>(),
      companyNames: new Set<string>(),
    };

    for (const conversation of conversationsQuery.data?.data ?? []) {
      if (!conversation.id || !approvedConversationIds.has(String(conversation.id))) {
        continue;
      }

      const applicationId = normalizeText(getConversationApplicationId(conversation));
      const campaignId = normalizeText(getConversationCampaignId(conversation));
      const campaignName = normalizeText(getConversationCampaignName(conversation));
      const companyName = normalizeText(getConversationCompanyName(conversation));

      if (applicationId) matches.applicationIds.add(applicationId);
      if (campaignId) matches.campaignIds.add(campaignId);
      if (campaignName) matches.campaignNames.add(campaignName);
      if (companyName) matches.companyNames.add(companyName);
    }

    return matches;
  }, [approvedConversationIds, conversationsQuery.data?.data]);

  // ─── Merge all sources into one list ───
  const cooperationItems = useMemo<CooperationItem[]>(() => {
    const seenCampaignIds = new Set<string>();
    const items: CooperationItem[] = [];

    // 1) Collaboration requests (Invitations from companies)
    for (const request of collabRequestsQuery.data?.data ?? []) {
      if (!request.campaign) continue;
      if (isClosedCampaignStatus(request.status)) continue;
      const cId = String(request.campaign.id);
      if (rejectedCampaignIds.has(cId)) continue;
      seenCampaignIds.add(cId);

      const reqCompany = request.company as Record<string, unknown> | null;
      const reqCampaign = request.campaign as Record<string, unknown>;
      const reqUser = request.user as Record<string, unknown> | null;
      const campaignUser = request.campaign.user as Record<string, unknown> | null;

      const companyName =
        request.company?.company_name ??
        (reqCompany?.brand_name as string | undefined) ??
        request.campaign.user?.company_name ??
        request.campaign.company_name ??
        (reqCampaign.brand_name as string | undefined) ??
        (reqCampaign.brand as string | undefined) ??
        (reqUser?.name as string | undefined) ??
        (campaignUser?.name as string | undefined) ??
        "-";
      const campaignName = getCampaignName(request.campaign);
      const approvedByConversationMatch =
        approvedConversationMatches.applicationIds.has(normalizeText(request.id)) ||
        approvedConversationMatches.campaignIds.has(
          normalizeText(request.campaign_id ?? request.campaign.id),
        ) ||
        Boolean(
          campaignName &&
            approvedConversationMatches.campaignNames.has(
              normalizeText(campaignName),
            ) &&
            (!companyName ||
              approvedConversationMatches.companyNames.has(
                normalizeText(companyName),
              )),
        );

      if (approvedByConversationMatch) {
        saveCompletedCampaignEntry({
          conversationId: request.conversation_id,
          applicationId: request.id,
          campaignId: request.campaign_id ?? request.campaign.id,
          campaignName,
          companyName,
          amount: request.price,
          category:
            request.campaign.campaign_type?.name ??
            request.campaign.campaignType?.name ??
            request.campaign.campaign_type_name,
          date: request.updated_at ?? request.created_at,
        });
        continue;
      }

      if (
        isCompletedByIdentity({
          conversationId: request.conversation_id,
          applicationId: request.id,
          campaignId: request.campaign_id ?? request.campaign.id,
          campaignName,
          companyName,
        })
      ) {
        continue;
      }

      items.push({
        id: `request-${request.id}`,
        campaign: request.campaign,
        companyName,
        requestId: request.id,
        source: "collaboration-request",
        status: request.status,
        price: request.price,
        conversationId: request.conversation_id,
      });
    }

    // 2) My applications (Requests I made to join campaigns)
    for (const app of myApplicationsQuery.data?.data ?? []) {
      if (!app.campaign) continue;
      if (isClosedCampaignStatus(app.status)) continue;
      const cId = String(app.campaign.id);
      if (rejectedCampaignIds.includes(cId)) continue;
      if (seenCampaignIds.has(cId)) continue;
      seenCampaignIds.add(cId);

      const appCampaign = app.campaign as Record<string, unknown>;
      const appUser = app.campaign.user as Record<string, unknown> | null;

      const companyName =
        app.campaign.user?.company_name ??
        app.campaign.company_name ??
        (appCampaign.brand_name as string | undefined) ??
        (appCampaign.brand as string | undefined) ??
        (appUser?.name as string | undefined) ??
        "-";
      const campaignName = getCampaignName(app.campaign);
      const approvedByConversationMatch =
        approvedConversationMatches.applicationIds.has(normalizeText(app.id)) ||
        approvedConversationMatches.campaignIds.has(
          normalizeText(app.campaign_id ?? app.campaign.id),
        ) ||
        Boolean(
          campaignName &&
            approvedConversationMatches.campaignNames.has(
              normalizeText(campaignName),
            ) &&
            (!companyName ||
              approvedConversationMatches.companyNames.has(
                normalizeText(companyName),
              )),
        );

      if (approvedByConversationMatch) {
        saveCompletedCampaignEntry({
          conversationId: app.conversation_id,
          applicationId: app.id,
          campaignId: app.campaign_id ?? app.campaign.id,
          campaignName,
          companyName,
          amount: app.price,
          category:
            app.campaign.campaign_type?.name ??
            app.campaign.campaignType?.name ??
            app.campaign.campaign_type_name,
          date: app.updated_at ?? app.created_at,
        });
        continue;
      }

      if (
        isCompletedByIdentity({
          conversationId: app.conversation_id,
          applicationId: app.id,
          campaignId: app.campaign_id ?? app.campaign.id,
          campaignName,
          companyName,
        })
      ) {
        continue;
      }

      items.push({
        id: `application-${app.id}`,
        campaign: app.campaign,
        companyName,
        applicationId: app.id,
        source: "my-application",
        executionDate: app.execution_date,
        price: app.price,
        status: app.status,
        conversationId: app.conversation_id,
      });
    }

    // 3) Available campaigns from influencer home endpoint
    for (const campaignItem of influencerDashboardQuery.data?.upcomingCampaigns ?? []) {
      const rawCampaign = campaignItem.raw ?? {};
      const campaign = {
        ...rawCampaign,
        id: campaignItem.id,
        name:
          (rawCampaign.name as string | undefined) ??
          (rawCampaign.title as string | undefined) ??
          campaignItem.type,
        company_name:
          (rawCampaign.company_name as string | undefined) ??
          campaignItem.brand,
        campaign_type_name:
          (rawCampaign.campaign_type_name as string | undefined) ??
          campaignItem.type,
        budget_range_name:
          (rawCampaign.budget_range_name as string | undefined) ??
          campaignItem.budget,
        created_at: rawCampaign.created_at as string | undefined,
        conversation_id:
          (rawCampaign.conversation_id as string | number | undefined) ??
          (rawCampaign.chat_id as string | number | undefined),
      } as Campaign;
      const cId = String(campaign.id);
      if (seenCampaignIds.has(cId)) continue;
      if (rejectedCampaignIds.includes(cId)) continue;
      seenCampaignIds.add(cId);

      const currentCamp = campaign as Record<string, unknown>;
      const companyName =
        campaignItem.brand ||
        campaign.user?.company_name ||
        campaign.company_name ||
        (currentCamp.brand_name as string | undefined) ||
        (currentCamp.brand as string | undefined) ||
        campaign.user?.name ||
        "-";

      items.push({
        id: `campaign-${campaign.id}`,
        campaign,
        companyName,
        source: "campaign",
        status: "available",
        price:
          (currentCamp.price as string | number | undefined) ??
          (currentCamp.budget as string | number | undefined) ??
          campaignItem.budget,
        conversationId: campaign.conversation_id,
      });
    }

    return items;
  }, [
    influencerDashboardQuery.data?.upcomingCampaigns,
    collabRequestsQuery.data?.data,
    myApplicationsQuery.data?.data,
    approvedConversationIds,
    approvedConversationMatches,
    rejectedCampaignIds,
  ]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAccept = (item: CooperationItem) => {
    if (acceptingItemId) return;
    setAcceptingItemId(item.id);

    const campaign = item.campaign;
    const convId =
      item.conversationId ||
      campaign.conversation_id ||
      getConversationIdFromResponse(item);

    const onAcceptSuccess = async (response: unknown) => {
      const responseConversationId = getConversationIdFromResponse(response);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["campaigns", "collaboration-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["campaigns", "company-collaboration-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.influencer(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.conversations(),
        }),
      ]);

      const finalConvId = await resolveAcceptedConversationId({
        queryClient,
        role: "influencer",
        peerName: item.companyName,
        existingConversationId:
          responseConversationId || convId,
      });
      navigate("/dashboard/influencer/messages", {
        state: {
          conversationId: finalConvId,
          isNew: Boolean(finalConvId),
          peerName: item.companyName,
          peerRole: "company",
        },
      });
      setAcceptingItemId(null);
    };

    const onAcceptError = (error: unknown) => {
      console.error("Accept error:", error);
      setAcceptingItemId(null);
    };

    if (item.source === "my-application" && item.applicationId) {
      if (isAcceptedStatus(item.status)) {
        void onAcceptSuccess(item);
      } else {
        setAcceptingItemId(null);
      }
    } else if (item.source === "collaboration-request" && item.requestId) {
      respondMutation.mutate(
        { requestId: item.requestId, status: "accepted" },
        { onSuccess: onAcceptSuccess, onError: onAcceptError }
      );
    } else if (item.source === "campaign") {
      const campToApply = campaign as Record<string, unknown>;
      applyCampaignMutation.mutate(
        {
          campaignId: Number(campaign.id),
          payload: {
            price: Number((campToApply.price as string | number | undefined) ?? (campToApply.budget as string | number | undefined) ?? 0),
            note: "Accepted from cooperation board",
            execution_date: new Date().toISOString().slice(0, 10),
            is_ready: true,
          },
        },
        {
          onSuccess: async (response) => {
            if (getConversationIdFromResponse(response)) {
              await onAcceptSuccess(response);
            } else {
              setAcceptingItemId(null);
            }
          },
          onError: onAcceptError,
        }
      );
    } else {
      if (convId) {
        void onAcceptSuccess(item);
      } else {
        setAcceptingItemId(null);
      }
    }
  };

  const handleReject = (item: CooperationItem) => {
    // Determine the ID to use for rejection based on source
    const requestId = item.requestId;
    const applicationId = item.applicationId;

    if (item.source === "collaboration-request" && requestId) {
      respondMutation.mutate({
        requestId: requestId,
        status: "rejected",
      });
    } else if (item.source === "my-application" && applicationId) {
      updateStatusMutation.mutate({
        applicationId: applicationId,
        status: "rejected",
      });
    } else {
    }

    addRejectedCampaignId(item.campaign.id);
  };

  const isActionPending =
    applyCampaignMutation.isPending || 
    respondMutation.isPending ||
    Boolean(acceptingItemId);

  const isLoading =
    influencerDashboardQuery.isLoading ||
    collabRequestsQuery.isLoading ||
    myApplicationsQuery.isLoading;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[rgba(255,255,255,1)]">
      <div className="relative h-44 w-full overflow-hidden sm:h-85">
        <img
          src={hero}
          alt={t("cooperation.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 -mt-1 bg-[rgba(255,255,255,1)] px-2 pb-20 pt-4 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-transparent py-0 sm:rounded-[28px] sm:bg-white sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="p-0 sm:p-8">
              <div className="mx-auto max-w-5xl">
                <div className="mb-8 text-center sm:mb-12">
                  <h1 className="inline-block text-[28px] font-bold text-[#22221f] sm:text-[38px]">
                    <span className="relative">
                      {t("cooperation.title")}
                      <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#22221f]" />
                    </span>
                  </h1>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
                  </div>
                ) : cooperationItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-sm text-[#a3a694] sm:text-base">
                      {t("cooperation.empty")}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-2">
                    {cooperationItems.map((item) => {
                      const campaign = item.campaign;
                      const camp = campaign as Record<string, unknown>;
                      const campUser = campaign.user as Record<string, unknown> | null;

                      const displayData = {
                        companyName: item.companyName,
                        contentType:
                          campaign.campaign_type?.name ??
                          campaign.campaignType?.name ??
                          campaign.campaign_type_name ??
                          ((camp.campaign_type as Record<string, unknown> | undefined)?.label as string) ??
                          (camp.idea as string | undefined) ??
                          (campUser?.field as string | undefined) ??
                          (camp.field as string | undefined) ??
                          "-",
                        date:
                          item.executionDate ??
                          campaign.execution_time?.name ??
                          campaign.executionTime?.name ??
                          formatDate(campaign.created_at),
                        budget: item.price
                          ? `${item.price} ريال`
                          : (campaign.budget_range?.name ??
                            campaign.budgetRange?.name ??
                            campaign.budget_range_name ??
                            "-"),
                      };

                      return (
                        <Card
                          key={item.id}
                          className="rounded-[12px] border border-[#f0f0f0] bg-[#fcfcfc]/50 py-0 shadow-none transition-all hover:shadow-sm sm:rounded-[18px]">
                          <CardContent className="px-4 py-5 sm:p-6">
                            <dl className="grid grid-cols-2 gap-x-2 gap-y-4">
                              <div className="flex items-baseline gap-1 text-right">
                                <dt className="whitespace-nowrap text-[10px] font-semibold text-[#2c2c27] sm:text-[12px]">
                                  {t("cooperation.companyName")} :
                                </dt>
                                <dd className="truncate text-[10px] text-[#86887e] sm:text-[12px]">
                                  {displayData.companyName}
                                </dd>
                              </div>

                              <div className="flex items-baseline gap-1 text-right">
                                <dt className="whitespace-nowrap text-[10px] font-semibold text-[#2c2c27] sm:text-[12px]">
                                  {t("cooperation.contentType")} :
                                </dt>
                                <dd className="truncate text-[10px] text-[#86887e] sm:text-[12px]">
                                  {displayData.contentType}
                                </dd>
                              </div>

                              <div className="flex items-baseline gap-1 text-right">
                                <dt className="whitespace-nowrap text-[10px] font-semibold text-[#2c2c27] sm:text-[12px]">
                                  {t("cooperation.date")} :
                                </dt>
                                <dd className="truncate text-[10px] text-[#86887e] sm:text-[12px]">
                                  {displayData.date}
                                </dd>
                              </div>

                              <div className="flex items-baseline gap-1 text-right">
                                <dt className="whitespace-nowrap text-[10px] font-semibold text-[#2c2c27] sm:text-[12px]">
                                  {t("cooperation.budget")} :
                                </dt>
                                <dd className="truncate text-[10px] text-[#86887e] sm:text-[12px]">
                                  {displayData.budget}
                                </dd>
                              </div>
                            </dl>

                            <Separator className="my-4 bg-[#f0f0f0]" />

                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleAccept(item)}
                                  disabled={isActionPending}
                                  className="h-9 rounded-[8px] border border-[#aacd9f] bg-transparent text-xs font-medium text-[#5faa55] hover:bg-[#f7fcf5] sm:h-11 sm:text-sm">
                                  {acceptingItemId === item.id || (respondMutation.isPending && respondMutation.variables?.status === "accepted" && String(respondMutation.variables?.requestId) === String(item.requestId))
                                    ? t("createCampaign.submitting", "Sending...")
                                    : isAcceptedStatus(item.status)
                                    ? t("cooperation.openChat", "فتح المحادثة")
                                    : t("cooperation.accept")}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleReject(item)}
                                  disabled={isActionPending}
                                  className="h-9 rounded-[8px] border border-[#ea9f9f] bg-transparent text-xs font-medium text-[#e25d5d] hover:bg-[#fff7f7] sm:h-11 sm:text-sm">
                                  {respondMutation.isPending && respondMutation.variables?.status === "rejected" && String(respondMutation.variables?.requestId) === String(item.requestId)
                                    ? t("cooperation.rejecting", "Rejecting...")
                                    : t("cooperation.reject")}
                                </Button>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  if (isAcceptedStatus(item.status)) {
                                    navigate(
                                      `/dashboard/influencer/${item.campaign.id}/publish?applicationId=${item.applicationId ?? ""}`,
                                    );
                                  }
                                }}
                                className="h-9 w-full rounded-[8px] border border-[#d7d4ca] bg-transparent text-xs font-medium text-[#6f6d66] hover:bg-[#faf9f5] sm:h-11 sm:text-sm">
                                {isAcceptedStatus(item.status)
                                  ? t("campaign.followPublishing", "متابعة النشر")
                                  : t("cooperation.negotiate")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cooperation;
