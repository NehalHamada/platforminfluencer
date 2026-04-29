import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bookmark,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";
import emptySearchImage from "/assets/search.png";
import type { Influencer } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

type LocalInfluencer = Influencer & {
  platform: string;
  audience: string;
};

function ExploreInfluencers() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [searchQuery, setSearchQuery] = useState("");
  const allLabel = isRTL ? "الكل" : "All";
  const [selectedPlatform, setSelectedPlatform] = useState(allLabel);
  const [selectedFollowers, setSelectedFollowers] = useState(allLabel);
  const [selectedEngagement, setSelectedEngagement] = useState(allLabel);
  const [selectedCategory, setSelectedCategory] = useState(allLabel);
  const [selectedAudience, setSelectedAudience] = useState(allLabel);

  const influencers = useMemo<LocalInfluencer[]>(
    () => [
      {
        id: 1,
        name: "Sara Hamed",
        category: "Skincare & Fashion",
        followers: "250k",
        engagement: "4.8",
        platform: "Instagram",
        audience: isRTL ? "السعودية" : "Saudi Arabia",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Sara Hamed",
        category: "Skincare & Fashion",
        followers: "250k",
        engagement: "4.8",
        platform: "Tiktok",
        audience: isRTL ? "الخليج" : "Gulf",
        image:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
      },
    ],
    [isRTL],
  );

  const filterConfigs = [
    {
      key: "platform",
      label: t("exploreInfluencers.platform"),
      value: selectedPlatform,
      onChange: setSelectedPlatform,
      options: [allLabel, "Instagram", "Tiktok"],
    },
    {
      key: "followers",
      label: t("exploreInfluencers.followers"),
      value: selectedFollowers,
      onChange: setSelectedFollowers,
      options: [allLabel, "100k+", "250k+"],
    },
    {
      key: "engagement",
      label: t("exploreInfluencers.engagement"),
      value: selectedEngagement,
      onChange: setSelectedEngagement,
      options: [allLabel, "4+", "4.5+"],
    },
    {
      key: "category",
      label: t("exploreInfluencers.category"),
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [allLabel, "Skincare & Fashion"],
    },
    {
      key: "audience",
      label: t("exploreInfluencers.audience"),
      value: selectedAudience,
      onChange: setSelectedAudience,
      options: [
        allLabel,
        isRTL ? "السعودية" : "Saudi Arabia",
        isRTL ? "الخليج" : "Gulf",
      ],
    },
  ] as const;

  const filteredInfluencers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return influencers.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          item.name,
          item.category,
          item.followers,
          item.engagement,
          item.platform,
          item.audience,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const followerValue = Number(item.followers.replace(/[^0-9.]/g, ""));
      const engagementValue = Number(item.engagement);

      const matchesPlatform =
        selectedPlatform === allLabel || item.platform === selectedPlatform;
      const matchesFollowers =
        selectedFollowers === allLabel ||
        (selectedFollowers === "100k+" && followerValue >= 100) ||
        (selectedFollowers === "250k+" && followerValue >= 250);
      const matchesEngagement =
        selectedEngagement === allLabel ||
        (selectedEngagement === "4+" && engagementValue >= 4) ||
        (selectedEngagement === "4.5+" && engagementValue >= 4.5);
      const matchesCategory =
        selectedCategory === allLabel || item.category === selectedCategory;
      const matchesAudience =
        selectedAudience === allLabel || item.audience === selectedAudience;

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesFollowers &&
        matchesEngagement &&
        matchesCategory &&
        matchesAudience
      );
    });
  }, [
    allLabel,
    influencers,
    searchQuery,
    selectedAudience,
    selectedCategory,
    selectedEngagement,
    selectedFollowers,
    selectedPlatform,
  ]);

  const resetFilters = () => {
    setSelectedPlatform(allLabel);
    setSelectedFollowers(allLabel);
    setSelectedEngagement(allLabel);
    setSelectedCategory(allLabel);
    setSelectedAudience(allLabel);
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-[#f3f3f1]">
      <div className="relative h-64 overflow-hidden sm:h-60 lg:h-64">
        <img src={hero} alt="hero" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 -mt-10 rounded-t-[34px] bg-[#f3f3f1] px-4 pb-12 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto hidden max-w-6xl space-y-6 md:block">
          {/* Search */}
          <div className="mx-auto max-w-md">
            <div className="relative">
              <Search
                size={16}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                  isRTL ? "right-3" : "left-3",
                )}
              />
              <Input
                placeholder={t("exploreInfluencers.searchPlaceholder")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={cn(
                  "h-11 rounded-full border-[#e3dfd5] bg-white pl-9 pr-9 shadow-none",
                  isRTL ? "text-right" : "text-left",
                )}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filterConfigs.map((filter) => (
              <DropdownMenu key={filter.key}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2 text-sm">
                    {filter.label}
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="min-w-44">
                  <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={filter.value}
                    onValueChange={filter.onChange}>
                    {filter.options.map((option) => (
                      <DropdownMenuRadioItem key={option} value={option}>
                        {option}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={resetFilters}>
                  {isRTL ? "إعادة ضبط الفلاتر" : "Reset filters"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredInfluencers.map((item) => (
              <Card key={item.id} className="group transition hover:shadow-md">
                <CardContent className="flex gap-4 p-4">
                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between space-y-3">
                    <div
                      className={cn(
                        "flex items-start justify-between",
                        isRTL && "flex-row-reverse",
                      )}>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-sm font-semibold">{item.name}</h3>
                      </div>

                      <Button size="icon" variant="ghost">
                        <Bookmark size={16} />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div
                      className={cn(
                        "flex items-center gap-6 text-sm",
                        isRTL && "flex-row-reverse",
                      )}>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          {t("exploreInfluencers.followersLabel")}
                        </p>
                        <p className="font-semibold">{item.followers}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          {t("exploreInfluencers.engagementLabel")}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {item.engagement}
                          </span>
                          <Star className="h-3 w-3 fill-primary text-primary" />
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" className="rounded-full">
                        {t("exploreInfluencers.viewProfile")}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full">
                        {t("exploreInfluencers.sendMessage")}
                      </Button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative w-28 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />

                    <div className="absolute top-2 flex w-full justify-end px-2">
                      <Button size="icon" variant="secondary">
                        <Bookmark size={12} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <Card className="border-0 bg-transparent py-0 shadow-none">
              <CardContent className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <img
                  src={emptySearchImage}
                  alt={t(
                    "exploreInfluencers.emptySearchTitle",
                    "No search results",
                  )}
                  className="h-64 w-auto object-contain"
                />
                <p className="mt-2 text-sm font-medium text-[#9cab80]">
                  {t(
                    "exploreInfluencers.emptySearchTitle",
                    "No search results",
                  )}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#6f6e67]">
                  {t(
                    "exploreInfluencers.emptySearch",
                    "No influencers matched your search. Try another keyword.",
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mx-auto max-w-sm space-y-5 md:hidden">
          <div className="text-center">
            <h1 className="text-sm font-medium text-[#43433d]">
              {t("exploreInfluencers.title", "اكتشف المؤثرين")}
            </h1>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-[16px] border border-[#e5e1d7] bg-white px-3 py-2 shadow-sm",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 rounded-full bg-[#eef2e6] text-[#99a97c] hover:bg-[#eef2e6] hover:text-[#99a97c]">
                  <SlidersHorizontal size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="min-w-56">
                <DropdownMenuLabel>
                  {isRTL ? "خيارات الفلترة" : "Filter options"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterConfigs.map((filter) => (
                  <DropdownMenuSub key={filter.key}>
                    <DropdownMenuSubTrigger>
                      {filter.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="min-w-44">
                      <DropdownMenuRadioGroup
                        value={filter.value}
                        onValueChange={filter.onChange}>
                        {filter.options.map((option) => (
                          <DropdownMenuRadioItem key={option} value={option}>
                            {option}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetFilters}>
                  {isRTL ? "إعادة ضبط الفلاتر" : "Reset filters"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative min-w-0 flex-1">
              <Search
                size={14}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-[#a3a198]",
                  isRTL ? "right-3" : "left-3",
                )}
              />
              <Input
                placeholder={t("exploreInfluencers.searchPlaceholder")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={cn(
                  "h-9 rounded-full border-[#ece7dd] bg-[#fbfaf7] px-9 text-xs shadow-none",
                  isRTL ? "text-right" : "text-left",
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredInfluencers.map((item, index) => (
              <Card
                key={`${item.id}-${index}`}
                className="overflow-hidden rounded-[16px] border border-[#e8e4da] bg-white py-0 shadow-sm">
                <CardContent className="p-0">
                  <div
                    className={cn(
                      "grid grid-cols-[1fr_5.4rem] gap-0",
                      isRTL && "[direction:rtl]",
                    )}>
                    <div className="space-y-3 px-3 py-3">
                      <div
                        className={cn(
                          "flex items-start justify-between gap-2",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <h3 className="text-xs font-semibold text-[#2d2d28]">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#ece7dd] bg-[#fbfaf7] text-[#b9b7ad]">
                          <Bookmark size={12} />
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex items-start justify-between gap-4 text-[11px]",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-[#908f87]">
                            {t("exploreInfluencers.followersLabel")}
                          </p>
                          <p className="font-semibold text-[#2d2d28]">
                            {item.followers}
                          </p>
                        </div>

                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-[#908f87]">
                            {t("exploreInfluencers.engagementLabel")}
                          </p>
                          <div
                            className={cn(
                              "flex items-center gap-1",
                              isRTL ? "flex-row-reverse" : "flex-row",
                            )}>
                            <span className="font-semibold text-[#2d2d28]">
                              {item.engagement}
                            </span>
                            <Star className="h-3 w-3 fill-[#c5b15f] text-[#c5b15f]" />
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#6f6e67]">
                        {item.category}
                      </p>

                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 rounded-full border-[#e7e3d8] bg-[#fbfaf7] px-3 text-[11px] text-[#76746c] shadow-none">
                          {t("exploreInfluencers.sendMessage")}
                        </Button>

                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ece7dd] bg-[#fbfaf7] text-[#b9b7ad]">
                          <Bookmark size={12} />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <Card className="rounded-[16px] border-0 bg-transparent py-0 shadow-none">
              <CardContent className="px-4 py-8 text-center">
                <img
                  src={emptySearchImage}
                  alt={t(
                    "exploreInfluencers.emptySearchTitle",
                    "No search results",
                  )}
                  className="mx-auto h-44 w-auto object-contain"
                />
                <p className="mt-2 text-xs font-medium text-[#9cab80]">
                  {t(
                    "exploreInfluencers.emptySearchTitle",
                    "No search results",
                  )}
                </p>
                <p className="mt-3 text-xs leading-6 text-[#6f6e67]">
                  {t(
                    "exploreInfluencers.emptySearch",
                    "No influencers matched your search. Try another keyword.",
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExploreInfluencers;
