import { authClients } from "@/lib/axios";
import type {
  ContactInfoResponse,
  ContactPayload,
  ContactResponse,
} from "@/types/contact.types";

export const contactService = {
  sendContactMessage: async (payload: ContactPayload) => {
    const reponse = await authClients.post<ContactResponse>(
      "/api/contact/send",
      payload,
    );
    return reponse.data;
  },

  getContactInfo: async () => {
    const response =
      await authClients.get<ContactInfoResponse>("/api/contact/info");
    return response.data.data;
  },
};
