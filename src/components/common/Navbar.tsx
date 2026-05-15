import { useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  CircleUser,
  Dot,
  Globe,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { AuthStore } from "@/types/auth.types";
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

const avatarColors = [
  "bg-[#8FA36A]",
  "bg-[#C07A59]",
  "bg-[#6F8FAF]",
  "bg-[#A66A8A]",
  "bg-[#7C8C5A]",
  "bg-[#B08A4A]",
];

const getAvatarColor = (seed: string) => {
  const total = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[total % avatarColors.length];
};

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const user = useAuthStore((state: AuthStore) => state.user);
  const isAuthenticated = useAuthStore(
    (state: AuthStore) => state.isAuthenticated,
  );
  const clearAuth = useAuthStore((state: AuthStore) => state.clearAuth);

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
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";
  const avatarColor = getAvatarColor(`${user?.id ?? ""}${user?.name ?? ""}`);

  const homeNavLinks: HomeLink[] = [
    { label: t("nav.platform"), href: "#platform" },
    { label: t("nav.ourResults"), href: "#follow" },
    { label: t("nav.whoUs"), href: "#about" },
    { label: t("nav.ourServices"), href: "#services" },
    { label: t("nav.influencers"), href: "#influencers" },
  ];

  const homeMobileNavLinks: HomeLink[] = [
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
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    window.setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
  };

  const submitMobileSearch = () => {
    const query = mobileSearchQuery.trim();

    if (!query) {
      setIsMobileSearchOpen(false);
      return;
    }

    navigate(`/dashboard/company/explore?search=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
  };

  const changeLanguage = () => {
    void i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const openProfileMenu = () => {
    if (profileMenuCloseTimer.current) {
      clearTimeout(profileMenuCloseTimer.current);
      profileMenuCloseTimer.current = null;
    }

    setIsProfileMenuOpen(true);
  };

  const closeProfileMenu = () => {
    profileMenuCloseTimer.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 100);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await authService.logout();
      toast.success(t("logout.success"));
    } catch {
      toast.error(t("logout.error"));
    } finally {
      sessionStorage.clear();
      sessionStorage.setItem("logoutRedirect", "home");
      localStorage.removeItem("otpEmail");
      clearAuth();
      setIsLoggingOut(false);
      closeMenu();
      window.location.replace("/");
    }
  };

  const renderProfileMenu = () => {
    if (!isAuthenticated || !user) {
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/login")}
          className="hidden cursor-pointer rounded-full text-white hover:bg-white/10 hover:text-white md:inline-flex"
          aria-label={t("nav.login", "Login")}>
          <CircleUser className="text-white" />
        </Button>
      );
    }

    return (
      <DropdownMenu
        modal={false}
        open={isProfileMenuOpen}
        onOpenChange={setIsProfileMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onPointerEnter={openProfileMenu}
            onPointerLeave={closeProfileMenu}
            className="hidden cursor-pointer rounded-full p-0 text-white hover:bg-white/10 hover:text-white md:inline-flex"
            aria-label={t("nav.profile", "Profile")}>
            <Avatar className="h-9 w-9 border border-white/35">
              <AvatarFallback
                className={cn("text-sm font-semibold text-white", avatarColor)}>
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isArabic ? "start" : "end"}
          onPointerEnter={openProfileMenu}
          onPointerLeave={closeProfileMenu}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="min-w-48 border-white/10 bg-white text-[#202020]">
          <DropdownMenuLabel className="truncate">
            {user.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
            <LogOut size={16} />
            {isLoggingOut ? t("logout.loading") : t("logout.label")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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

  const renderMobileProfileIcon = () => {
    if (!isAuthenticated || !user) {
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/80 text-white">
          <CircleUser size={16} />
        </span>
      );
    }

    return (
      <Avatar className="h-9 w-9 border border-white/35">
        <AvatarFallback
          className={cn("text-sm font-semibold text-white", avatarColor)}>
          {userInitial}
        </AvatarFallback>
      </Avatar>
    );
  };

  const renderMobileLanguageToggle = () => (
    <Button
      type="button"
      variant="ghost"
      onClick={changeLanguage}
      className="h-14 w-full justify-between rounded-md bg-white/10 px-5 text-white hover:bg-white/15 hover:text-white">
      <span className="flex items-center gap-2">
        <Globe size={24} />
      </span>
      <span className="flex items-center gap-3 text-base font-medium">
        {isArabic ? "العربية" : "English"}
        <ChevronDown size={18} />
      </span>
    </Button>
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
        : homeMobileNavLinks.map((link) => ({
            key: link.href,
            label: link.label,
            action: () => closeMenu(),
            href: link.href,
            active: false,
          }));

    const showAuthLogin = !isAuthenticated && !isAuth;

    return (
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side={isArabic ? "left" : "right"}
          className="w-full border-0 bg-[rgba(26,20,37,1)] p-0 text-white sm:max-w-sm"
          showCloseButton={false}>
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="flex h-full flex-col px-5 py-7">
            <SheetHeader className="sr-only">
              <SheetTitle>{t("nav.messages")}</SheetTitle>
            </SheetHeader>

            <div
              className={cn(
                "flex h-14 items-center justify-between rounded-full border border-white/25 bg-[rgba(111,66,193,0.2)] px-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
                isArabic ? "flex-row-reverse" : "flex-row",
              )}>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={closeMenu}
                aria-label="Close menu"
                className="rounded-full cursor-pointer text-white hover:bg-white/10 hover:text-white">
                <Menu size={26} />
              </Button>

              <img
                src={logo}
                alt="logo"
                className="h-9 w-auto object-contain"
              />

              {renderMobileProfileIcon()}
            </div>

            <div className="flex flex-1 flex-col pt-7">
              <div
                className={cn(
                  isHome ? "flex flex-col gap-5 pt-2" : "flex flex-col gap-2",
                  isArabic ? "items-end text-right" : "items-start text-left",
                )}>
                {mobileLinks.map((link) =>
                  link.href ? (
                    <a
                      key={link.key}
                      href={link.href}
                      onClick={link.action}
                      className={cn(
                        isHome
                          ? "w-full rounded-md py-1 text-lg font-semibold text-white/95 transition hover:text-white"
                          : "w-full rounded-md py-2 text-lg font-semibold text-white/90 transition hover:text-white",
                        isArabic ? "text-right" : "text-left",
                      )}>
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
                        "h-auto w-full cursor-pointer rounded-md px-0 py-2 text-lg font-semibold",
                        isArabic
                          ? "justify-end text-right"
                          : "justify-start text-left",
                        link.active
                          ? "text-white hover:bg-transparent hover:text-white"
                          : "text-white/90 hover:bg-transparent hover:text-white",
                      )}>
                      {link.label}
                    </Button>
                  ),
                )}
              </div>

              <div
                className={cn("space-y-6 pb-3", isHome ? "mt-8" : "mt-auto")}>
                {renderMobileLanguageToggle()}

                {showAuthLogin && !isHome && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      navigate("/login");
                      closeMenu();
                    }}
                    className="mx-auto h-auto rounded-none px-0 text-lg font-semibold text-white underline underline-offset-4 hover:bg-transparent hover:text-white/85">
                    {t("nav.login", "Login")}
                    <ArrowLeft size={20} />
                  </Button>
                )}

                {isAuthenticated && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mx-auto h-auto rounded-none px-0 text-lg font-semibold text-white underline underline-offset-4 hover:bg-transparent hover:text-white/85">
                    {isLoggingOut ? t("logout.loading") : t("logout.label")}
                    <ArrowLeft size={20} />
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
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-[rgba(26,20,37,0.75)] px-4 py-3 backdrop-blur-md md:px-5 md:py-4">
            {mobileMenuButton}

            <div className="hidden md:block">{brandButton("/")}</div>

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
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              {isMobileSearchOpen ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitMobileSearch();
                  }}
                  className="relative md:hidden">
                  <Input
                    ref={mobileSearchInputRef}
                    type="search"
                    value={mobileSearchQuery}
                    onChange={(event) =>
                      setMobileSearchQuery(event.target.value)
                    }
                    onBlur={() => {
                      if (!mobileSearchQuery.trim()) {
                        setIsMobileSearchOpen(false);
                      }
                    }}
                    placeholder={t("nav.search")}
                    className={cn(
                      "h-9 w-40 rounded-full border border-white/25 bg-white/10 text-sm text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0",
                      isArabic ? "pl-9 pr-3 text-right" : "pr-9 pl-3 text-left",
                    )}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("nav.search")}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-white/10 hover:text-white",
                      isArabic ? "left-1" : "right-1",
                    )}>
                    <Search size={15} />
                  </Button>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={openMobileSearch}
                  aria-label={t("nav.search")}
                  className="rounded-full cursor-pointer text-white hover:bg-white/10 hover:text-white md:hidden">
                  <Search size={22} />
                </Button>
              )}
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
          <div className="flex items-center justify-between rounded-[32px] border border-white/10 bg-[rgba(26,20,37,0.75)] px-4 py-3 backdrop-blur-xl shadow-[0_0_20px_rgba(111,66,193,0.25)] md:px-6 md:py-4">
            {brandButton("/dashboard/influencer")}
            {renderDesktopLinks(influencerNavLinks)}
            <div className="flex items-center gap-3 text-white">
              {renderProfileMenu()}
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
          <div className="flex items-center justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(26,20,37,0.75)] px-2 py-1 backdrop-blur-xl shadow-[0_0_20px_rgba(111,66,193,0.25)] md:px-5 md:py-4">
            {brandButton("/dashboard/company")}
            {renderDesktopLinks(companyNavLinks, true)}
            <div className="flex shrink-0 items-center gap-3 text-white">
              {renderProfileMenu()}
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
      <div className="flex items-center justify-between rounded-full bg-[rgba(26,20,37,0.75)]">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/")}
          className="h-auto cursor-pointer p-0 hover:bg-transparent">
          <img src={logo} alt="logo" width={100} />
        </Button>

        <div className="me-3 flex items-center gap-3">
          <LanguageToggle />
          {!isAuth && renderProfileMenu()}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
