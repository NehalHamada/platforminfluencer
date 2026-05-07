import { queryKeys } from "@/constants/queryKeys";
import { chatService } from "@/services/chat.service";
import type { Conversation, ConversationListResponse } from "@/types/chat.types";
import type { QueryClient } from "@tanstack/react-query";

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const getObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const getPeerName = (
  conversation: Conversation,
  role: "company" | "influencer",
) => {
  const peer =
    role === "company"
      ? (conversation.influencer ??
        conversation.participant ??
        conversation.other_user ??
        conversation.company)
      : (conversation.company ??
        conversation.participant ??
        conversation.other_user ??
        conversation.influencer);
  const peerObj = getObject(peer);

  return normalize(peerObj?.company_name) || normalize(peerObj?.name);
};

const findConversationIdByPeer = (
  conversations: Conversation[],
  role: "company" | "influencer",
  peerName?: string,
) => {
  const normalizedPeer = normalize(peerName);
  if (!normalizedPeer) return undefined;

  const conversation = conversations.find(
    (item) => getPeerName(item, role) === normalizedPeer,
  );

  return conversation?.id;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function resolveAcceptedConversationId({
  queryClient,
  role,
  peerName,
  existingConversationId,
}: {
  queryClient: QueryClient;
  role: "company" | "influencer";
  peerName?: string;
  existingConversationId?: string | number;
}) {
  if (existingConversationId) return existingConversationId;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await queryClient.fetchQuery<ConversationListResponse>({
      queryKey: queryKeys.chat.conversations(),
      queryFn: chatService.getConversations,
      staleTime: 0,
    });

    const conversationId = findConversationIdByPeer(
      response.data ?? [],
      role,
      peerName,
    );

    if (conversationId) return conversationId;
    await wait(700);
  }

  return undefined;
}
