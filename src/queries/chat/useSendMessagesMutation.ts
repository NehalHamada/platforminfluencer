import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { queryKeys } from "@/constants/queryKeys";
import type {
  Message,
  MessageListResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat.types";

type SendPayload = Omit<SendMessagePayload, "conversation_id">;

export function useSendMessageMutation(
  conversationId: string | number | undefined,
  currentUserId: string | number | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendMessageResponse,
    Error,
    SendPayload,
    { previousMessages?: MessageListResponse } | undefined
  >({
    mutationFn: (data) =>
      chatService.sendMessage({
        ...data,
        conversation_id: conversationId as number,
      }),

    onMutate: async (newMessage) => {
      if (!conversationId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.chat.messages(conversationId),
      });

      const previousMessages = queryClient.getQueryData<MessageListResponse>(
        queryKeys.chat.messages(conversationId),
      );

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        message: newMessage.message,
        sender_id: currentUserId,
        type: newMessage.type,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<MessageListResponse>(
        queryKeys.chat.messages(conversationId),
        (old) => ({
          success: true,
          data: [...(old?.data ?? []), optimisticMessage],
        }),
      );

      return { previousMessages };
    },

    onError: (_err, _vars, context: { previousMessages?: MessageListResponse } | undefined) => {
      if (context?.previousMessages !== undefined && conversationId) {
        queryClient.setQueryData(
          queryKeys.chat.messages(conversationId),
          context.previousMessages,
        );
      }
    },

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
