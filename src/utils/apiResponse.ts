type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value && typeof value === "object");

const getId = (value: unknown): string | number | undefined =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

export function getConversationIdFromResponse(value: unknown): string | number | undefined {
  if (!isObject(value)) return undefined;

  const direct =
    value.conversation_id ??
    value.conversationId ??
    value.chat_id ??
    value.chatId;
  const directId = getId(direct);
  if (directId) return directId;

  const conversation = value.conversation;
  if (isObject(conversation)) {
    const id = getId(conversation.id);
    if (id) return id;
  }

  const chat = value.chat;
  if (isObject(chat)) {
    const id = getId(chat.id);
    if (id) return id;
  }

  const nestedKeys = [
    "data",
    "application",
    "collaboration_request",
    "collaborationRequest",
    "request",
  ];

  for (const key of nestedKeys) {
    const nested = value[key];
    if (isObject(nested)) {
      const nestedId = getConversationIdFromResponse(nested);
      if (nestedId) return nestedId;
    }
  }

  return undefined;
}
