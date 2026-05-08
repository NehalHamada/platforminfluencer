import { useLocation } from "react-router-dom";
import ChatPage from "@/components/chat/ChatPage";
import { useMemo } from "react";
import { useAllCampaignApplicationsQuery } from "@/queries/campaigns/useAllCampaignApplicationsQuery";
import { useCompanyCollaborationRequestsQuery } from "@/queries/campaigns/useCompanyCollaborationRequestsQuery";
import type { Conversation } from "@/types/chat.types";

const isAcceptedStatus = (status?: string) =>
  status === "accepted" || status === "accept" || status === "content_approved";

function Message() {
  const location = useLocation();
  const contactMessage = (location.state as { contactMessage?: string })
    ?.contactMessage;
  const companyRequestsQuery = useCompanyCollaborationRequestsQuery();
  const campaignApplicationsQuery = useAllCampaignApplicationsQuery();
  const fallbackConversations = useMemo<Conversation[]>(
    () => {
      const collabRequestConversations = (companyRequestsQuery.data?.data ?? [])
        .filter((request) => isAcceptedStatus(request.status) && request.conversation_id)
        .map((request) => {
          const influencer = request.influencer ?? request.user ?? null;

          return {
            id: request.conversation_id as string | number,
            status: request.status,
            campaign_name: request.campaign?.name,
            influencer,
            company: request.company ?? null,
            last_message: "",
            messages: [],
          };
        });

      const applicationConversations = (campaignApplicationsQuery.data?.data ?? [])
        .filter((application) => isAcceptedStatus(application.status) && application.conversation_id)
        .map((application) => ({
          id: application.conversation_id as string | number,
          status: application.status,
          campaign_name: application.campaign?.name,
          influencer: application.user ?? null,
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
