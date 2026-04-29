import { contactService } from "@/services/contact.service";
import type { ContactPayload, ContactResponse } from "@/types/contact.types";
import { useMutation } from "@tanstack/react-query";

export function useSendContactMessageMutation() {
  return useMutation<ContactResponse, Error, ContactPayload>({
    mutationFn: contactService.sendContactMessage,
  });
}
