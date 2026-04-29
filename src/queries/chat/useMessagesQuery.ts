import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { queryKeys } from "@/constants/queryKeys";
import type { MessageListResponse } from "@/types/chat.types";

export function useMessagesQuery(conversationId: string) {
  return useQuery<MessageListResponse, Error>({
    queryKey: queryKeys.chat.messages(conversationId),
    queryFn: () => chatService.getMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}
