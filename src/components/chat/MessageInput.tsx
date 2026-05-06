import { useState } from "react";
import { ImagePlus, Mic, SendHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  isRTL: boolean;
  onSendMessage?: (text: string) => void;
  isSending?: boolean;
};

function MessageInput({ isRTL, onSendMessage, isSending }: MessageInputProps) {
  const { t } = useTranslation();
  const placeholder = t("chat.thread.inputPlaceholder");
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSendMessage?.(trimmed);
    setText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="border-t border-[#efeee8] bg-white px-0 pt-2 sm:pt-4">
      <form
        className={cn(
          "flex items-end gap-1 border border-[#ece7d9] bg-white px-1 py-1 sm:gap-3 sm:px-2 sm:py-2",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}
        onSubmit={handleSubmit}
        aria-label={placeholder}>
        <Button
          variant="default"
          type="submit"
          size="icon"
          disabled={!text.trim() || isSending}
          aria-label={t("chat.thread.sendLabel", "Send message")}
          className="h-5 w-5 shrink-0 rounded-xs text-white sm:h-10 sm:w-10 sm:rounded-[8px]">
          <SendHorizontal
            className={cn("h-3 w-3 sm:h-4 sm:w-4", isRTL && "scale-x-[-1]")}
          />
        </Button>

        <div
          className={cn(
            "hidden items-center gap-1 text-[#697061] sm:flex sm:gap-2",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("chat.thread.voiceLabel", "Record voice message")}
            className="h-8 w-8 rounded-md text-[#4d5348] hover:bg-[#f4f1e8] hover:text-[#2f342d]">
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("chat.thread.attachLabel", "Attach image")}
            className="h-8 w-8 rounded-md text-[#4d5348] hover:bg-[#f4f1e8] hover:text-[#2f342d]">
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <label htmlFor="chat-message-input" className="sr-only">
            {placeholder}
          </label>
          <Textarea
            id="chat-message-input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "max-h-16 min-h-5 resize-none border-0 bg-transparent px-2 py-1 text-[8px] text-[#30362c] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-h-28 sm:min-h-10 sm:py-2 sm:text-sm",
              "placeholder:text-[#b2ac9f]",
              isRTL ? "text-right" : "text-left",
            )}
          />
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
