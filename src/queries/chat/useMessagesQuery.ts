import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { queryKeys } from "@/constants/queryKeys";
import type { MessageListResponse } from "@/types/chat.types";

export function useMessagesQuery(conversationId: string | number | undefined) {
  return useQuery<MessageListResponse, Error>({
    queryKey: queryKeys.chat.messages(conversationId),
    queryFn: () => chatService.getMessages(conversationId as string | number),
    enabled: Boolean(conversationId),
    staleTime: 5000,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
