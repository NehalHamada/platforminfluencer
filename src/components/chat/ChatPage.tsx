import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ConvertCampaignFormData } from "@/types/dashboard.types";

import MessageThread from "./MessageThread";

export type ChatMessage = {
  id: string;
  sender: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  time: string;
  type?: "text" | "agreement";
  agreement?: ConvertCampaignFormData;
};

export type ChatConversation = {
  id: string;
  name: string;
  avatar: string;
  roleLabel: string;
  campaignName: string;
  campaignBudget: string;
  category: string;
  status: string;
  lastMessage: string;
  lastActive: string;
  unreadCount: number;
  messages: ChatMessage[];
};

type ChatPageProps = {
  role: "company" | "influencer";
};

const avatars = {
  sara: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  lina: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  noor: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  user: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  growth:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  lumina:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  olive:
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
} as const;

function ChatPage({ role }: ChatPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const conversations = useMemo<ChatConversation[]>(
    () =>
      role === "company"
        ? [
            {
              id: "sara",
              name: isRTL ? "سارة حامد" : "Sara Hamed",
              avatar: avatars.sara,
              roleLabel: t("chat.mock.company.influencerRole"),
              campaignName: isRTL
                ? "إطلاق مجموعة Glow الصيفية"
                : "Glow summer launch",
              campaignBudget: isRTL
                ? "الميزانية 12,500 ر.س"
                : "Budget SAR 12,500",
              category: t("chat.mock.company.categories.skincare"),
              status: t("chat.mock.status.inReview"),
              lastMessage: t("chat.mock.company.conversations.sara.preview"),
              lastActive: t("chat.mock.time.mins5"),
              unreadCount: 2,
              messages: [
                {
                  id: "1",
                  sender: "other",
                  name: isRTL ? "سارة حامد" : "Sara Hamed",
                  avatar: avatars.sara,
                  text: t("chat.mock.company.conversations.sara.message1"),
                  time: t("chat.mock.time.am0915"),
                  type: "text",
                },
                {
                  id: "2",
                  sender: "me",
                  name: "Growth",
                  avatar: avatars.user,
                  text: t("chat.mock.company.conversations.sara.message2"),
                  time: t("chat.mock.time.am0918"),
                  type: "text",
                },
                {
                  id: "3",
                  sender: "other",
                  name: isRTL ? "سارة حامد" : "Sara Hamed",
                  avatar: avatars.sara,
                  text: t("chat.mock.company.conversations.sara.message3"),
                  time: t("chat.mock.time.am0924"),
                  type: "text",
                },
              ],
            },
          ]
        : [
            {
              id: "growth",
              name: "Growth",
              avatar: avatars.growth,
              roleLabel: t("chat.mock.influencer.companyRole"),
              campaignName: isRTL
                ? "حملة Glow للعناية بالبشرة"
                : "Glow skincare campaign",
              campaignBudget: isRTL
                ? "قيمة التعاون 12,500 ر.س"
                : "Collab value SAR 12,500",
              category: t("chat.mock.influencer.categories.productLaunch"),
              status: t("chat.mock.status.active"),
              lastMessage: t(
                "chat.mock.influencer.conversations.growth.preview",
              ),
              lastActive: t("chat.mock.time.now"),
              unreadCount: 3,
              messages: [
                {
                  id: "1",
                  sender: "other",
                  name: "Growth",
                  avatar: avatars.growth,
                  text: t("chat.mock.influencer.conversations.growth.message1"),
                  time: t("chat.mock.time.am1002"),
                  type: "text",
                },
                {
                  id: "2",
                  sender: "me",
                  name: isRTL ? "سارة حامد" : "Sara Hamed",
                  avatar: avatars.sara,
                  text: t("chat.mock.influencer.conversations.growth.message2"),
                  time: t("chat.mock.time.am1011"),
                  type: "text",
                },
                {
                  id: "3",
                  sender: "other",
                  name: "Growth",
                  avatar: avatars.growth,
                  text: t("chat.mock.influencer.conversations.growth.message3"),
                  time: t("chat.mock.time.am1016"),
                  type: "text",
                },
              ],
            },
          ],
    [isRTL, role, t],
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    conversations[0]?.messages ?? [],
  );

  const selectedConversation = useMemo(
    () =>
      conversations[0]
        ? {
            ...conversations[0],
            messages: chatMessages,
          }
        : undefined,
    [chatMessages, conversations],
  );

  if (!selectedConversation) {
    return null;
  }

  const handleAgreementSubmit = (data: ConvertCampaignFormData) => {
    const now = new Date();
    const time = now.toLocaleTimeString(isRTL ? "ar" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setChatMessages((current) => [
      ...current,
      {
        id: `agreement-${Date.now()}`,
        sender: "me",
        name:
          role === "company" ? "Growth" : isRTL ? "سارة حامد" : "Sara Hamed",
        avatar: role === "company" ? avatars.user : avatars.sara,
        time,
        type: "agreement",
        agreement: data,
      },
    ]);
  };

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-0 pt-0"
      aria-labelledby="chat-page-title">
      <Card className="mx-auto  border-0 bg-transparent py-0 shadow-none ring-0">
        <CardHeader className="sr-only px-0">
          <h1 id="chat-page-title" className="text-base font-medium">
            {selectedConversation.campaignName}
          </h1>
        </CardHeader>

        <CardContent className="px-0">
          <div className="sr-only" aria-live="polite">
            {selectedConversation.lastMessage}
          </div>

          <MessageThread
            conversation={selectedConversation}
            isRTL={isRTL}
            onAgreementSubmit={handleAgreementSubmit}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default ChatPage;
