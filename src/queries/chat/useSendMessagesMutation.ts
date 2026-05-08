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

const getObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const getId = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

const getSentMessage = (
  response: SendMessageResponse,
  fallback: SendPayload,
  conversationId: string | number | undefined,
  currentUserId: string | number | undefined,
): Message => {
  const data = getObject(response.data);
  const nestedMessage =
    getObject(data?.message) ??
    getObject(data?.data) ??
    data ??
    getObject(response);

  return {
    id:
      getId(nestedMessage?.id) ??
      `sent-${conversationId ?? "conversation"}-${Date.now()}`,
    message:
      typeof nestedMessage?.message === "string"
        ? nestedMessage.message
        : fallback.message,
    sender_id: getId(nestedMessage?.sender_id) ?? currentUserId,
    type: (nestedMessage?.type as Message["type"]) ?? fallback.type,
    delivery_date:
      (nestedMessage?.delivery_date as string | null | undefined) ??
      fallback.delivery_date,
    media_url:
      (nestedMessage?.media_url as string | null | undefined) ??
      fallback.media_url,
    notes: (nestedMessage?.notes as string | null | undefined) ?? fallback.notes,
    created_at:
      (nestedMessage?.created_at as string | null | undefined) ??
      new Date().toISOString(),
    conversation_id: getId(nestedMessage?.conversation_id) ?? conversationId,
  };
};

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

    onSuccess: (response, variables) => {
      if (conversationId) {
        const sentMessage = getSentMessage(
          response,
          variables,
          conversationId,
          currentUserId,
        );

        queryClient.setQueryData<MessageListResponse>(
          queryKeys.chat.messages(conversationId),
          (old) => {
            const messages = old?.data ?? [];
            const nextMessages = messages.some(
              (message) => String(message.id) === String(sentMessage.id),
            )
              ? messages.map((message) =>
                  String(message.id) === String(sentMessage.id)
                    ? sentMessage
                    : message,
                )
              : [
                  ...messages.filter(
                    (message) => !String(message.id).startsWith("temp-"),
                  ),
                  sentMessage,
                ];

            return {
              success: true,
              data: nextMessages,
            };
          },
        );
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
}
