import { useState } from "react";
import { ImagePlus, Mic, SendHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  isRTL: boolean;
  onSendMessage?: (text: string) => boolean | Promise<boolean> | void;
  isSending?: boolean;
};

function MessageInput({ isRTL, onSendMessage, isSending }: MessageInputProps) {
  const { t } = useTranslation();
  const placeholder = t("chat.thread.inputPlaceholder", "اكتب رسالتك هنا...");
  const [text, setText] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    const wasSent = await onSendMessage?.(trimmed);
    if (wasSent !== false) {
      setText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="bg-white px-0 pt-2">
      <form
        className={cn(
          "flex items-center gap-3 border border-[#ece7d9] bg-white px-3 py-2.5 rounded-[20px]",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}
        onSubmit={handleSubmit}>
        
        {/* Left Side Icons (Grouped) */}
        <div className={cn("flex items-center gap-2", isRTL ? "flex-row" : "flex-row-reverse")}>
          <Button
            variant="default"
            type="submit"
            size="icon"
            disabled={!text.trim() || isSending}
            className="h-11 w-11 shrink-0 rounded-full bg-[#b8c99a] text-white hover:bg-[#a6b889] shadow-sm">
            <SendHorizontal
              className={cn("h-5 w-5", isRTL && "scale-x-[-1]")}
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-[#a3a694] hover:bg-[#f4f1e8] rounded-full">
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-[#a3a694] hover:bg-[#f4f1e8] rounded-full">
            <ImagePlus className="h-5 w-5" />
          </Button>
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <Textarea
            id="chat-message-input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "max-h-28 min-h-11 resize-none border-0 bg-transparent px-2 py-3 text-sm sm:text-base text-[#30362c] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
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
