import { useLocation } from "react-router-dom";
import ChatPage from "@/components/chat/ChatPage";
import { useMemo } from "react";
import { useCompanyCollaborationRequestsQuery } from "@/queries/campaigns/useCompanyCollaborationRequestsQuery";
import type { Conversation } from "@/types/chat.types";

function Message() {
  const location = useLocation();
  const contactMessage = (location.state as { contactMessage?: string })
    ?.contactMessage;
  const companyRequestsQuery = useCompanyCollaborationRequestsQuery();
  const fallbackConversations = useMemo<Conversation[]>(
    () =>
      (companyRequestsQuery.data?.data ?? [])
        .filter((request) => request.status === "accepted" && request.conversation_id)
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
        }),
    [companyRequestsQuery.data?.data],
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
