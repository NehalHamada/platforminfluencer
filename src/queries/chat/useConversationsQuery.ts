import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { queryKeys } from "@/constants/queryKeys";
import type { ConversationListResponse } from "@/types/chat.types";

export function useConversationsQuery() {
  return useQuery<ConversationListResponse, Error>({
    queryKey: queryKeys.chat.conversations(),
    queryFn: chatService.getConversations,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
}
