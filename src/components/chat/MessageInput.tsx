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
          "flex items-center gap-2 rounded-[4px] border border-[#eee8dc] bg-white px-2 py-1.5 shadow-none sm:gap-3 sm:px-3 sm:py-2",
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
            className="h-8 w-8 shrink-0 rounded-[4px] bg-[#8fa36a] text-white shadow-none hover:bg-[#81975f] sm:h-10 sm:w-10">
            <SendHorizontal
              className={cn("h-5 w-5", isRTL && "scale-x-[-1]")}
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[4px] text-[#8f9487] hover:bg-[#f4f1e8] sm:h-10 sm:w-10">
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[4px] text-[#8f9487] hover:bg-[#f4f1e8] sm:h-10 sm:w-10">
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
              "max-h-24 min-h-8 resize-none border-0 bg-transparent px-2 py-2 text-[10px] text-[#30362c] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-10 sm:text-sm",
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
