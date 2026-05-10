import type { UserRole } from "./auth.types";
import type { ConvertCampaignFormData } from "./dashboard.types";

export type RegistrationSuccessPopupProps = {
  open: boolean;
  title: string;
  description: string;
  image: string;
  userType: UserRole;
  buttonText?: string;
  onClose?: () => void;
};

export type ConvertCampaignPopupProps = {
  open: boolean;
  onClose: () => void;
  campaignName?: string;
  onSubmitSuccess?: (
    data: ConvertCampaignFormData,
  ) => boolean | void | Promise<boolean | void>;
  isSubmitting?: boolean;
};

export type UiStore = {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isGlobalLoading: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  setGlobalLoading: (value: boolean) => void;
};
