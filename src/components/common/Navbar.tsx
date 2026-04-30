import { useState } from "react";
import { CircleUser, Dot, Menu, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "/assets/logo.svg";

import LanguageToggle from "./LanguageToggle";

type DashboardLink = {
  label: string;
  path: string;
};

type HomeLink = {
  label: string;
  href: string;
};

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authRoutes = [
    "/login",
    "/register",
    "/register/influencer",
    "/register/company",
    "/forget-password",
    "/verify-otp",
    "/reset-password",
  ];

  const isArabic = i18n.language === "ar";
  const isAuth = authRoutes.some((route) => route === location.pathname);
  const isHome = location.pathname === "/";
  const isCompanyProfilePage = location.pathname === "/influencer-profile";
  const isInfluencerPath =
    location.pathname.includes("influencer") && !isCompanyProfilePage;
  const isCompanyPath =
    location.pathname.includes("company") || isCompanyProfilePage;

  const homeNavLinks: HomeLink[] = [
    { label: t("nav.platform"), href: "#platform" },
    { label: t("nav.ourResults"), href: "#follow" },
    { label: t("nav.whoUs"), href: "#about" },
    { label: t("nav.ourServices"), href: "#services" },
    { label: t("nav.influencers"), href: "#influencers" },
  ];

  const influencerNavLinks: DashboardLink[] = [
    { label: t("nav.home"), path: "/dashboard/influencer" },
    { label: t("nav.profits"), path: "/dashboard/influencer/earnings" },
    { label: t("nav.cooperation"), path: "/dashboard/influencer/cooperation" },
    { label: t("nav.campaigns"), path: "/dashboard/influencer/campaigns" },
    { label: t("nav.messages"), path: "/dashboard/influencer/messages" },
    { label: t("nav.offers"), path: "/dashboard/influencer/offers" },
  ];

  const companyNavLinks: DashboardLink[] = [
    { label: t("nav.home"), path: "/dashboard/company" },
    {
      label: t("nav.exploreInfluencers"),
      path: "/dashboard/company/explore",
    },
    {
      label: t("nav.influencerRequest"),
      path: "/dashboard/company/campaign-requests",
    },
    { label: t("nav.campaigns"), path: "/dashboard/company/campaigns" },
    { label: t("nav.messages"), path: "/dashboard/company/messages" },
    {
      label: t("nav.createCampaign"),
      path: "/dashboard/company/create",
    },
    {
      label: t("nav.contactUs"),
      path: "/dashboard/company/contact",
    },
    {
      label: t("nav.whoAreWe"),
      path: "/dashboard/company/whoarewe",
    },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const renderSearch = () => (
    <div className="relative">
      <Search
        className={cn(
          "absolute top-1/2 size-4 -translate-y-1/2 text-white/70",
          isArabic ? "left-3" : "right-3",
        )}
      />
      <Input
        type="search"
        placeholder={t("nav.search")}
        className={cn(
          "h-10 w-full rounded-full border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0",
          isArabic ? "pl-10 pr-4 text-right" : "pr-10 pl-4 text-left",
        )}
      />
    </div>
  );

  const renderDesktopLinks = (links: DashboardLink[], compact = false) => (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "hidden min-w-0 flex-1 items-center md:flex",
        compact
          ? "justify-start gap-0 overflow-x-auto px-2 lg:justify-center"
          : "justify-center gap-3 lg:gap-5",
      )}>
      {links.map((link) => {
        const isActive =
          location.pathname === link.path ||
          (isCompanyProfilePage && link.path === "/dashboard/company/explore");

        return (
          <div
            key={link.path}
            className={cn("flex shrink-0 items-center", compact && "px-1.5")}>
            <Dot
              size={compact ? 14 : 20}
              className={cn(
                "text-white/90",
                compact ? "mx-1.5 lg:mx-2" : "mx-2",
              )}
              aria-hidden="true"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(link.path)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "h-auto cursor-pointer px-0 font-medium whitespace-nowrap",
                compact ? "text-[12px] lg:text-[13px]" : "text-sm lg:text-base",
                isActive
                  ? "text-white hover:bg-transparent hover:text-white"
                  : "text-white/90 hover:bg-transparent hover:text-white",
              )}>
              {link.label}
            </Button>
          </div>
        );
      })}
    </nav>
  );

  const renderMobileSheet = () => {
    const mobileLinks = isInfluencerPath
      ? influencerNavLinks.map((link) => ({
          key: link.path,
          label: link.label,
          action: () => {
            navigate(link.path);
            closeMenu();
          },
          href: undefined,
          active:
            location.pathname === link.path ||
            (isCompanyProfilePage &&
              link.path === "/dashboard/company/explore"),
        }))
      : isCompanyPath
        ? companyNavLinks.map((link) => ({
            key: link.path,
            label: link.label,
            action: () => {
              navigate(link.path);
              closeMenu();
            },
            href: undefined,
            active:
              location.pathname === link.path ||
              (isCompanyProfilePage &&
                link.path === "/dashboard/company/explore"),
          }))
        : homeNavLinks.map((link) => ({
            key: link.href,
            label: link.label,
            action: () => closeMenu(),
            href: link.href,
            active: false,
          }));

    return (
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side={isArabic ? "left" : "right"}
          className="w-[92vw] border-white/10 bg-[rgba(104,139,52,0.94)] p-0 text-white backdrop-blur-xl sm:max-w-sm"
          showCloseButton={false}>
          <div dir={isArabic ? "rtl" : "ltr"} className="flex h-full flex-col">
            <SheetHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <SheetTitle className="text-white">
                  {t("nav.messages")}
                </SheetTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="rounded-full cursor-pointer text-white hover:bg-white/10 hover:text-white">
                  <X size={18} />
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 px-4 py-4">
              {isHome && <div className="mb-4">{renderSearch()}</div>}

              <div className="flex flex-col gap-2">
                {mobileLinks.map((link) =>
                  link.href ? (
                    <a
                      key={link.key}
                      href={link.href}
                      onClick={link.action}
                      className="rounded-2xl px-4 py-3 text-white/95 transition hover:bg-white/10">
                      {link.label}
                    </a>
                  ) : (
                    <Button
                      key={link.key}
                      type="button"
                      variant="ghost"
                      onClick={link.action}
                      aria-current={link.active ? "page" : undefined}
                      className={cn(
                        "h-auto justify-start cursor-pointer rounded-2xl px-4 py-3 text-start",
                        link.active
                          ? "bg-white/15 text-white hover:bg-white/15 hover:text-white"
                          : "text-white/95 hover:bg-white/10 hover:text-white",
                      )}>
                      {link.label}
                    </Button>
                  ),
                )}

                {!isAuth && !isInfluencerPath && !isCompanyPath && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      navigate("/login");
                      closeMenu();
                    }}
                    className="h-auto cursor-pointer justify-start rounded-2xl px-4 py-3 text-start text-white/95 hover:bg-white/10 hover:text-white">
                    {t("nav.login", "Login")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  const brandButton = (targetPath: string) => (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate(targetPath)}
      className="h-auto cursor-pointer p-0 hover:bg-transparent">
      <img
        src={logo}
        alt="logo"
        className="h-10 w-auto object-contain lg:h-12"
      />
    </Button>
  );

  const mobileMenuButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setIsMenuOpen((prev) => !prev)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      className="rounded-full cursor-pointer text-white hover:bg-white/10 hover:text-white md:hidden">
      {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
    </Button>
  );

  if (isHome) {
    return (
      <>
        <header
          dir={isArabic ? "rtl" : "ltr"}
          className="fixed top-4 left-1/2 z-50 w-[95%] -translate-x-1/2">
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-[rgba(104,139,52,0.45)] px-4 py-3 backdrop-blur-md md:px-5 md:py-4">
            {mobileMenuButton}

            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-3 text-sm font-medium text-white md:flex">
              {homeNavLinks.map((link, index) => (
                <div key={link.label} className="flex items-center">
                  {index !== 0 && (
                    <Dot
                      size={22}
                      className="mx-1 text-white/90"
                      aria-hidden="true"
                    />
                  )}
                  <a
                    href={link.href}
                    className="cursor-pointer text-sm font-medium text-white/95 transition hover:text-white">
                    {link.label}
                  </a>
                </div>
              ))}
            </nav>

            <div className="relative hidden w-65 md:block">
              {renderSearch()}
            </div>

            <div className="flex items-center gap-3 text-white">
              <LanguageToggle />
            </div>
          </div>
        </header>
        {renderMobileSheet()}
      </>
    );
  }

  if (isInfluencerPath) {
    return (
      <>
        <header
          dir={isArabic ? "rtl" : "ltr"}
          className="absolute top-4 left-1/2 z-50 w-[97%] -translate-x-1/2">
          <div className="flex items-center justify-between rounded-[32px] border border-white/10 bg-[rgba(104,139,52,0.45)] px-4 py-3 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] md:px-6 md:py-4">
            {brandButton("/dashboard/influencer")}
            {renderDesktopLinks(influencerNavLinks)}
            <div className="flex items-center gap-3 text-white">
              {!isAuth && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="hidden cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white md:inline-flex"
                  aria-label="Profile">
                  <CircleUser size={20} />
                </Button>
              )}
              <LanguageToggle />
              {mobileMenuButton}
            </div>
          </div>
        </header>
        {renderMobileSheet()}
      </>
    );
  }

  if (isCompanyPath) {
    return (
      <>
        <header
          dir={isArabic ? "rtl" : "ltr"}
          className="absolute top-4 left-1/2 z-50 w-[97%] -translate-x-1/2">
          <div className="flex items-center justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(104,139,52,0.45)] px-2 py-1 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] md:px-5 md:py-4">
            {brandButton("/dashboard/company")}
            {renderDesktopLinks(companyNavLinks, true)}
            <div className="flex shrink-0 items-center text-white">
              {!isAuth && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="hidden cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white md:inline-flex"
                  aria-label="Profile">
                  <CircleUser size={20} />
                </Button>
              )}
              <LanguageToggle />
              {mobileMenuButton}
            </div>
          </div>
        </header>
        {renderMobileSheet()}
      </>
    );
  }

  return (
    <header className="absolute top-4 left-1/2 z-50 w-[90%] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full bg-[rgba(104,139,52,0.45)]">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/")}
          className="h-auto cursor-pointer p-0 hover:bg-transparent">
          <img src={logo} alt="logo" width={100} />
        </Button>

        <div className="me-3 flex items-center gap-3">
          <LanguageToggle />
          {!isAuth && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate("/login")}
              className="hidden cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white md:inline-flex"
              aria-label="Login">
              <CircleUser className="text-white" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
