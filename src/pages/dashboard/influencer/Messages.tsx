import ChatPage from "@/components/chat/ChatPage";
import { useMemo } from "react";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import type { Conversation } from "@/types/chat.types";
import type { ApiUser } from "@/types/campaign.types";

const isAcceptedStatus = (status?: string) =>
  status === "accepted" || status === "accept" || status === "content_approved";

const getRequestCompany = (request: {
  company?: ApiUser | null;
  user?: ApiUser | null;
  campaign?: ({ user?: ApiUser | null } & Record<string, unknown>) | null;
}) => {
  const source = request.company ?? request.user ?? request.campaign?.user ?? null;
  const companyName =
    request.company?.company_name ??
    request.campaign?.user?.company_name ??
    (typeof request.campaign?.company_name === "string"
      ? request.campaign.company_name
      : undefined) ??
    (typeof request.campaign?.brand_name === "string"
      ? request.campaign.brand_name
      : undefined);

  if (!source) {
    return companyName ? ({ company_name: companyName } as ApiUser) : null;
  }

  return {
    ...source,
    company_name: companyName ?? source.company_name,
  };
};

const getApplicationCompany = (application: {
  campaign?: ({ user?: ApiUser | null } & Record<string, unknown>) | null;
}) => {
  const source = application.campaign?.user ?? null;
  const companyName =
    application.campaign?.user?.company_name ??
    (typeof application.campaign?.company_name === "string"
      ? application.campaign.company_name
      : undefined) ??
    (typeof application.campaign?.brand_name === "string"
      ? application.campaign.brand_name
      : undefined);

  if (!source) {
    return companyName ? ({ company_name: companyName } as ApiUser) : null;
  }

  return {
    ...source,
    company_name: companyName ?? source.company_name,
  };
};

function Message() {
  const collabRequestsQuery = useCollaborationRequestsQuery();
  const myApplicationsQuery = useCampaignRequestsQuery();
  const fallbackConversations = useMemo<Conversation[]>(() => {
    const acceptedCollabRequests =
      collabRequestsQuery.data?.data
        ?.filter((request) => isAcceptedStatus(request.status) && request.conversation_id)
        .map((request) => ({
          id: request.conversation_id as string | number,
          status: request.status,
          campaign_name: request.campaign?.name,
          company: getRequestCompany(request),
          influencer: request.influencer ?? null,
          last_message: "",
          messages: [],
        })) ?? [];

    const acceptedApplications =
      myApplicationsQuery.data?.data
        ?.filter((application) => isAcceptedStatus(application.status) && application.conversation_id)
        .map((application) => ({
          id: application.conversation_id as string | number,
          status: application.status,
          campaign_name: application.campaign?.name,
          company: getApplicationCompany(application),
          influencer: application.user ?? null,
          last_message: "",
          messages: [],
        })) ?? [];

    const seenIds = new Set<string>();

    return [...acceptedCollabRequests, ...acceptedApplications].filter(
      (conversation) => {
        const id = String(conversation.id);

        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      },
    );
  }, [collabRequestsQuery.data?.data, myApplicationsQuery.data?.data]);

  return <ChatPage role="influencer" extraConversations={fallbackConversations} />;
}

export default Message;
