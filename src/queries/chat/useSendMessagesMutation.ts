import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { queryKeys } from "@/constants/queryKeys";
import type {
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat.types";

export function useSendMessageMutation(conversationId: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, SendMessagePayload>({
    mutationFn: chatService.sendMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(conversationId),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
}
