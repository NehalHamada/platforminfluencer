import { useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
};

function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";

  const changeLanguage = (language: string) => {
    if (language !== i18n.language) {
      void i18n.changeLanguage(language);
    }
  };

  useEffect(() => {
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => changeLanguage(currentLanguage === "ar" ? "en" : "ar")}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Change language"
          className={cn(
            "me-3 cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/30",
            className,
          )}>
          <Globe className="text-white" />
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

export default LanguageToggle;
