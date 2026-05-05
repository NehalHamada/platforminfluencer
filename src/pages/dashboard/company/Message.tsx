import { useLocation } from "react-router-dom";
import ChatPage from "@/components/chat/ChatPage";

function Message() {
  const location = useLocation();
  const contactMessage = (location.state as { contactMessage?: string })
    ?.contactMessage;

  return <ChatPage role="company" initialMessage={contactMessage} />;
}

export default Message;
