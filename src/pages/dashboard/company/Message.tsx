import { useLocation } from "react-router-dom";
import ChatPage from "@/components/chat/ChatPage";
import { useMemo } from "react";
import { useAllCampaignApplicationsQuery } from "@/queries/campaigns/useAllCampaignApplicationsQuery";
import { useCompanyCollaborationRequestsQuery } from "@/queries/campaigns/useCompanyCollaborationRequestsQuery";
import type { Conversation } from "@/types/chat.types";
import { getConversationIdFromResponse } from "@/utils/apiResponse";
import { isClosedCampaignStatus } from "@/utils/campaignProgress";
import {
  isCompletedApplicationId,
  isCompletedCampaignId,
  isCompletedConversationId,
} from "@/utils/completedCampaigns";

const isAcceptedStatus = (status?: string) =>
  ["accepted", "accept", "approved"].indexOf(
    String(status ?? "").toLowerCase(),
  ) !== -1 && !isClosedCampaignStatus(status);

function Message() {
  const location = useLocation();
  const contactMessage = (location.state as { contactMessage?: string })
    ?.contactMessage;
  const companyRequestsQuery = useCompanyCollaborationRequestsQuery();
  const campaignApplicationsQuery = useAllCampaignApplicationsQuery();
  const fallbackConversations = useMemo<Conversation[]>(
    () => {
      const collabRequestConversations = (companyRequestsQuery.data?.data ?? [])
        .map((request) => {
          const conversationId =
            request.conversation_id ?? getConversationIdFromResponse(request);

          return { request, conversationId };
        })
        .filter(({ request, conversationId }) =>
          Boolean(
            isAcceptedStatus(request.status) &&
              !isCompletedConversationId(conversationId) &&
              !isCompletedCampaignId(request.campaign_id ?? request.campaign?.id),
          ),
        )
        .map((request) => {
          const item = request.request;
          const influencer = item.influencer ?? item.user ?? null;

          return {
            id: (request.conversationId ?? `pending:req:${item.id}`) as string | number,
            status: item.status,
            campaign_id: item.campaign_id ?? item.campaign?.id,
            campaign_name: item.campaign?.name,
            campaign_budget:
              item.campaign?.budget_range?.name ??
              item.campaign?.budgetRange?.name ??
              item.campaign?.budget_range_name ??
              item.price,
            category:
              item.campaign?.campaign_type?.name ??
              item.campaign?.campaignType?.name ??
              item.campaign?.campaign_type_name,
            influencer,
            company: item.company ?? item.campaign?.user ?? null,
            last_message: "",
            messages: [],
          };
        });

      const applicationConversations = (campaignApplicationsQuery.data?.data ?? [])
        .filter(
          (application) =>
            isAcceptedStatus(application.status) &&
            !isCompletedConversationId(application.conversation_id) &&
            !isCompletedApplicationId(application.id) &&
            !isCompletedCampaignId(
              application.campaign_id ?? application.campaign?.id,
            ),
        )
        .map((application) => ({
          id: (application.conversation_id ?? `pending:app:${application.id}`) as string | number,
          status: application.status,
          application_id: application.id,
          campaign_id: application.campaign_id ?? application.campaign?.id,
          campaign_name: application.campaign?.name,
          campaign_budget:
            application.campaign?.budget_range?.name ??
            application.campaign?.budgetRange?.name ??
            application.campaign?.budget_range_name ??
            application.price,
          category:
            application.campaign?.campaign_type?.name ??
            application.campaign?.campaignType?.name ??
            application.campaign?.campaign_type_name,
          influencer: application.influencer ?? application.user ?? null,
          company: application.campaign?.user ?? null,
          last_message: "",
          messages: [],
        }));

      const seenIds = new Set<string>();

      return [...collabRequestConversations, ...applicationConversations].filter(
        (conversation) => {
          const id = String(conversation.id);

          if (seenIds.has(id)) return false;
          seenIds.add(id);
          return true;
        },
      );
    },
    [campaignApplicationsQuery.data?.data, companyRequestsQuery.data?.data],
  );

  return (
    <ChatPage
      role="company"
      initialMessage={contactMessage}
      extraConversations={fallbackConversations}
    />
  );
}

export default Message;
