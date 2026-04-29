import type { LucideIcon } from "lucide-react";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export type InfoCard = {
  key: string;
  icon: LucideIcon;
  value: string;
};

export type ContactInfoContent = {
  phones: string[];
  email: string;
  address: string;
};

export type ContactInfoData = {
  id: number;
  key: string;
  title: string | null;
  description: string | null;
  content: ContactInfoContent;
};

export type ContactInfoResponse = {
  success: boolean;
  data: ContactInfoData;
};
