import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApplyCampaignMutation } from "@/queries/campaigns/useApplyCampaignMutation";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";
import { useRespondToCollaborationRequestMutation } from "@/queries/campaigns/useRespondToCollaborationRequestMutation";
import { useInfluencerDashboardQuery } from "@/queries/dashboard/useInfluencerDashboardQuery";
import type { Campaign } from "@/types/campaign.types";
import { getConversationIdFromResponse } from "@/utils/apiResponse";
import { resolveAcceptedConversationId } from "@/utils/chat";

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

function Cooperation() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ─── Data sources ───
  const influencerDashboardQuery = useInfluencerDashboardQuery();
  const collabRequestsQuery = useCollaborationRequestsQuery();
  const myApplicationsQuery = useCampaignRequestsQuery();

  const applyCampaignMutation = useApplyCampaignMutation();
  const respondMutation = useRespondToCollaborationRequestMutation();
  const [acceptingItemId, setAcceptingItemId] = useState<string | null>(null);

  const [rejectedCampaignIds, setRejectedCampaignIds] = useState<Set<string>>(
    () => new Set(),
  );

  // ─── Merge all sources into one list ───
  const cooperationItems = useMemo<CooperationItem[]>(() => {
    const seenCampaignIds = new Set<string>();
    const items: CooperationItem[] = [];

    // 1) Collaboration requests (Invitations from companies)
    for (const request of collabRequestsQuery.data?.data ?? []) {
      if (!request.campaign) continue;
      const cId = String(request.campaign.id);
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
      const cId = String(app.campaign.id);
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
      if (rejectedCampaignIds.has(cId)) continue;
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

    console.log("Cooperation Data:", items);
    return items;
  }, [
    influencerDashboardQuery.data?.upcomingCampaigns,
    collabRequestsQuery.data?.data,
    myApplicationsQuery.data?.data,
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

    console.log("Accepting item via API:", item);

    const onAcceptSuccess = async (response: unknown) => {
      console.log("Accept success:", response);
      const finalConvId = await resolveAcceptedConversationId({
        queryClient,
        role: "influencer",
        peerName: item.companyName,
        existingConversationId:
          convId || getConversationIdFromResponse(response),
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
      // Even if API fails, try to open chat if we have an ID or name
      navigate("/dashboard/influencer/messages", {
        state: {
          conversationId: convId,
          isNew: true,
          peerName: item.companyName,
          peerRole: "company",
        },
      });
      setAcceptingItemId(null);
    };

    // 1. My applications are accepted/rejected only by the company.
    // If the application is already accepted, just open the chat.
    if (item.source === "my-application" && item.applicationId) {
      void onAcceptSuccess(item);
    } 
    // 2. If it's a direct request, respond with accepted
    else if (item.source === "collaboration-request" && item.requestId) {
      respondMutation.mutate(
        { requestId: item.requestId, status: "accepted" },
        { onSuccess: onAcceptSuccess, onError: onAcceptError }
      );
    } 
    // 3. If it's a new campaign, apply to it
    else if (item.source === "campaign") {
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
        { onSuccess: onAcceptSuccess, onError: onAcceptError }
      );
    } 
    // 4. Fallback
    else {
      navigate("/dashboard/influencer/messages", {
        state: {
          conversationId: convId,
          isNew: true,
          peerName: item.companyName,
          peerRole: "company",
        },
      });
      setAcceptingItemId(null);
    }
  };

  const handleReject = (item: CooperationItem) => {
    // For collaboration requests → tell the backend
    if (item.source === "collaboration-request" && item.requestId) {
      respondMutation.mutate({
        requestId: item.requestId,
        status: "rejected",
      });
    }

    // Always hide locally
    setRejectedCampaignIds((prev) => {
      const next = new Set(prev);
      next.add(String(item.campaign.id));
      return next;
    });
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

                      // Align with backend keys and Image 2
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
                        // Prefer execution_date if it's an application, otherwise execution_time name
                        date:
                          item.executionDate ??
                          campaign.execution_time?.name ??
                          campaign.executionTime?.name ??
                          formatDate(campaign.created_at),
                        // Show item price if available, else budget range
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
                                    {acceptingItemId === item.id
                                      ? t("createCampaign.submitting", "Sending...")
                                      : item.status === "accepted"
                                      ? t("cooperation.openChat", "فتح المحادثة")
                                      : t("cooperation.accept")}
                                  </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleReject(item)}
                                  disabled={isActionPending}
                                  className="h-9 rounded-[8px] border border-[#ea9f9f] bg-transparent text-xs font-medium text-[#e25d5d] hover:bg-[#fff7f7] sm:h-11 sm:text-sm">
                                  {t("cooperation.reject")}
                                </Button>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 w-full rounded-[8px] border border-[#d7d4ca] bg-transparent text-xs font-medium text-[#6f6d66] hover:bg-[#faf9f5] sm:h-11 sm:text-sm">
                                {t("cooperation.negotiate")}
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
