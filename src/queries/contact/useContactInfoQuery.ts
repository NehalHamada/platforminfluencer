import { contactService } from "@/services/contact.service";
import { useQuery } from "@tanstack/react-query";

export function useContactInfoQuery() {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: contactService.getContactInfo,
  });
}
