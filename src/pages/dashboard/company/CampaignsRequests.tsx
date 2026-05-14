import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import hero from "/assets/Hero.png";
import { cn } from "@/lib/utils";
import { getConversationIdFromResponse } from "@/utils/apiResponse";
import { resolveAcceptedConversationId } from "@/utils/chat";
import { useAllCampaignApplicationsQuery } from "@/queries/campaigns/useAllCampaignApplicationsQuery";
import { useCampaignApplicationsQuery } from "@/queries/campaigns/useCampaignApplicationsQuery";
import { useUpdateApplicationStatusMutation } from "@/queries/campaigns/useUpdateApplicationStatusMutation";
import type { CampaignRequest } from "@/types/campaign.types";
import { queryKeys } from "@/constants/queryKeys";
import { isClosedCampaignStatus } from "@/utils/campaignProgress";
import {
  isCompletedApplicationId,
  isCompletedCampaignId,
} from "@/utils/completedCampaigns";

function CampaignsRequests() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaignId");
  const requestsQuery = useCampaignApplicationsQuery(campaignId || "", Boolean(campaignId));
  const allRequestsQuery = useAllCampaignApplicationsQuery(!campaignId);
  const statusMutation = useUpdateApplicationStatusMutation();
  const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null);
  const activeQuery = campaignId ? requestsQuery : allRequestsQuery;
  const requests = (activeQuery.data?.data ?? []).filter(
    (request) =>
      !isClosedCampaignStatus(request.status) &&
      !isCompletedApplicationId(request.id) &&
      !isCompletedCampaignId(request.campaign_id ?? request.campaign?.id),
  );
  const getPlatformLabel = (request: CampaignRequest) =>
    request.campaign?.platform?.name ?? "-";

  const getInfluencerName = (request: CampaignRequest) =>
    request.user?.name ||
    request.influencer?.name ||
    t("campaignsRequest.creatorLabel");

  const getInfluencerImage = (request: CampaignRequest) =>
    request.user?.avatar ||
    request.user?.image ||
    request.user?.profile_image ||
    request.influencer?.avatar ||
    request.influencer?.image ||
    request.influencer?.profile_image ||
    "";

  const getCampaignName = (request: CampaignRequest) =>
    request.campaign?.name ||
    request.campaign?.idea ||
    t("campaignsRequest.unknownCampaign", "Campaign");

  const getContentType = (request: CampaignRequest) =>
    request.campaign?.campaign_type?.name ??
    request.campaign?.campaignType?.name ??
    request.campaign?.campaign_type_name ??
    "-";

  const getCampaignBudget = (request: CampaignRequest) =>
    request.campaign?.budget_range?.name ??
    request.campaign?.budgetRange?.name ??
    request.campaign?.budget_range_name ??
    request.price ??
    "";

  const getExecutionDate = (request: CampaignRequest) =>
    request.execution_date ||
    request.campaign?.execution_time?.name ||
    request.campaign?.executionTime?.name ||
    "-";

  const getReadinessLabel = (request: CampaignRequest) =>
    Number(request.is_ready) === 1
      ? t("campaignsRequest.ready", "Ready")
      : t("campaignsRequest.notReady", "Not ready");

  const handleStatusChange = (
    request: CampaignRequest,
    status: "accepted" | "rejected",
  ) => {
    if (updatingRequestId) return;
    setUpdatingRequestId(request.id);

    statusMutation.mutate(
      {
        applicationId: request.id,
        status,
      },
      {
        onSuccess: async (response) => {
          if (status === "rejected") {
            setUpdatingRequestId(null);
            return;
          }
          
          // Force refresh of conversations list
          await queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });

          const peerName = getInfluencerName(request);
          const conversationId = await resolveAcceptedConversationId({
            queryClient,
            role: "company",
            peerName,
            existingConversationId:
              request.conversation_id ??
              getConversationIdFromResponse(request) ??
              getConversationIdFromResponse(response),
          });

          navigate("/dashboard/company/messages", {
            state: {
              conversationId,
              isNew: Boolean(conversationId),
              peerName,
              peerRole: "influencer",
              campaignId: request.campaign_id ?? request.campaign?.id,
              applicationId: request.id,
              campaignName: getCampaignName(request),
              campaignBudget: getCampaignBudget(request),
              category: getContentType(request),
            },
          });
          setUpdatingRequestId(null);
        },
        onSettled: () => {
          setUpdatingRequestId(null);
        },
      },
    );
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-[#efefeb]">
      <div className="relative h-44 w-full overflow-hidden sm:h-64 lg:h-72">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 -mt-1 rounded-t-[10px] bg-[#f7f6f2] px-2 pb-20 pt-4 sm:-mt-12 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center sm:mb-8">
            <h1 className="text-[12px] font-semibold text-[#20201d] sm:text-3xl">
              {t("campaignsRequest.title")}
            </h1>
            <p className="mx-auto mt-2 max-w-44 text-[8px] leading-4 text-[#707068] sm:mt-3 sm:max-w-2xl sm:text-base sm:leading-normal">
              {t("campaignsRequest.description")}
            </p>
          </div>

          <div className="bg-transparent p-0 shadow-none sm:rounded-[30px] sm:bg-white/90 sm:p-6 sm:shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activeQuery.isLoading ? (
                <div className="col-span-full flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
                </div>
              ) : requests.length === 0 ? (
                <p className="col-span-full py-14 text-center text-sm text-[#a3a694]">
                  {t("campaignsRequest.empty", "No campaign applications yet")}
                </p>
              ) : requests.map((request) => (
                <Card
                  key={request.id}
                  className="rounded-lg border border-[#ece9e1] bg-white py-0 shadow-none sm:rounded-xl sm:shadow-sm">
                  <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-center justify-between gap-2 sm:gap-3",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}>
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                        <AvatarImage
                          src={getInfluencerImage(request)}
                          alt={getInfluencerName(request)}
                        />
                        <AvatarFallback>
                          {getInfluencerName(request).charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          "flex-1",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <p className="text-[9px] font-medium text-[#2e2e29] sm:text-sm">
                          {getInfluencerName(request)}
                        </p>
                        <p className="text-[7px] text-[#8b8b8b] sm:text-xs">
                          {getCampaignName(request)}
                        </p>
                      </div>

                      <Badge className="gap-1 bg-[#eef2e6] px-1.5 py-1 text-[7px] text-[#8b9677] sm:px-2.5 sm:text-xs">
                        <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {request.status}
                      </Badge>
                    </div>

                    {/* Platforms */}
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                        {t("campaignsRequest.platforms")}:
                      </p>
                      <p className="hidden text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                        {isRTL ? "المنصات :" : "Platforms:"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                          <Badge
                            key={request.campaign?.platform?.id}
                            variant="secondary"
                            className="justify-center rounded-sm bg-[#f7f7f4] px-2 py-1 text-[8px] font-normal text-[#55554f] shadow-none sm:rounded-full sm:text-xs">
                            {getPlatformLabel(request)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="justify-center rounded-sm bg-[#f7f7f4] px-2 py-1 text-[8px] font-normal text-[#55554f] shadow-none sm:rounded-full sm:text-xs">
                            {getContentType(request)}
                          </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                          {t("campaignsRequest.requestedPrice")}:
                        </p>
                        <p className="text-[9px] text-[#55554f] sm:text-sm">
                          {request.price}
                        </p>
                      </div>

                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                          {t("campaignsRequest.executionDate", "Execution date")}:
                        </p>
                        <p className="text-[9px] text-[#55554f] sm:text-sm">
                          {getExecutionDate(request)}
                        </p>
                      </div>

                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                          {t("campaignsRequest.readiness", "Readiness")}:
                        </p>
                        <p className="text-[9px] text-[#55554f] sm:text-sm">
                          {getReadinessLabel(request)}
                        </p>
                      </div>

                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                          {t("campaignsRequest.note")}:
                        </p>
                        <p className="line-clamp-2 text-[9px] text-[#55554f] sm:text-sm">
                          {request.note || "-"}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="grid grid-cols-2 border-t border-[#f0eee8] p-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleStatusChange(request, "accepted")}
                      disabled={statusMutation.isPending || Boolean(updatingRequestId)}
                      className="h-8 gap-1 text-[9px] text-[#70b46b] hover:bg-[#f6fbf4] sm:h-11 sm:text-sm">
                      {updatingRequestId === request.id && statusMutation.variables?.status === "accepted"
                        ? t("createCampaign.submitting", "Sending...")
                        : t("campaignsRequest.accept")}
                      <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleStatusChange(request, "rejected")}
                      disabled={statusMutation.isPending || Boolean(updatingRequestId)}
                      className="h-8 gap-1 text-[9px] text-[#ff5d5d] hover:bg-[#fff8f8] sm:h-11 sm:text-sm">
                      {updatingRequestId === request.id && statusMutation.variables?.status === "rejected"
                        ? t("campaignsRequest.rejecting", "Rejecting...")
                        : t("campaignsRequest.reject")}
                      <CircleX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignsRequests;
