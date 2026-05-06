import {
  BadgeCheck,
  Bookmark,
  ChevronDown,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInfluencerDiscoveryQuery } from "@/queries/dashboard/useInfluencerDiscoveryQuery";
import { useContentTypesQuery } from "@/queries/masterData/useContentTypesQuery";
import { useFollowerRangesQuery } from "@/queries/masterData/useFollowerRangesQuery";
import { usePlatformsQuery } from "@/queries/masterData/usePlatformsQuery";
import type {
  InfluencerDiscoveryItem,
  InfluencerDiscoveryQueryParams,
} from "@/types/dashboard.types";

import hero from "/assets/Hero.png";
import emptySearchImage from "/assets/search.png";

type FilterOption = {
  label: string;
  value: string;
};

function PlatformIcon({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();
  if (lower.includes("tiktok")) {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-black text-white">
        <FaTiktok className="text-[9px]" />
      </div>
    );
  }
  if (lower.includes("instagram")) {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] text-white">
        <FaInstagram className="text-[9px]" />
      </div>
    );
  }
  return null;
}

function InfluencerCard({
  item,
  isRTL,
}: {
  item: InfluencerDiscoveryItem;
  isRTL: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/influencer-profile/${item.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/dashboard/company/contact");
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-[18px] border border-[#e5e2db] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-h-38" dir="ltr">
        <div
          className="flex flex-1 flex-col justify-between p-3.5"
          dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex-1 truncate text-[13px] font-semibold text-[#1d1d1a]">
              {item.name}
            </h3>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#b5c09a] hover:bg-[#f3f5ef]"
              aria-label="Bookmark">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-start">
            <div className="flex-1 pe-3">
              <p className="text-[15px] font-bold leading-none text-[#1d1d1a]">
                {item.followers || "—"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#8b8b84]">
                {t("exploreInfluencers.followersLabel")}
              </p>
            </div>
            <div className="flex-1 border-s border-[#ebebeb] ps-3">
              <div className="flex items-center gap-0.5">
                <p className="text-[15px] font-bold leading-none text-[#1d1d1a]">
                  {item.engagement || "—"}
                </p>
                <Star className="h-3 w-3 fill-[#f5c518] text-[#f5c518]" />
              </div>
              <p className="mt-0.5 text-[10px] text-[#8b8b84]">
                {t("exploreInfluencers.engagementLabel")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="truncate text-[11px] text-[#6f6e67]">
              {item.category || item.audience || "—"}
            </span>
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-[#a7b78e] text-white" />
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-fit gap-1.5 rounded-full border-[#d5dbc9] px-3 text-[11px] text-[#617047] hover:bg-[#f2f5ec]"
            onClick={handleButtonClick}>
            <MessageCircle className="h-3 w-3" />
            {t("exploreInfluencers.sendMessage")}
          </Button>
        </div>

        {/* Image — right side, full card height, no padding */}
        <div className="relative w-[38%] shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {item.platform ? (
            <div className="absolute bottom-2.5 left-2.5">
              <PlatformIcon platform={item.platform} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExploreInfluencers() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const allLabel = t("common.all", "All");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFollowers, setSelectedFollowers] = useState("");
  const [selectedEngagement, setSelectedEngagement] = useState("");
  const [selectedFameLevel, setSelectedFameLevel] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("");

  const platformsQuery = usePlatformsQuery();
  const followerRangesQuery = useFollowerRangesQuery();
  const contentTypesQuery = useContentTypesQuery();

  const discoveryParams = useMemo<InfluencerDiscoveryQueryParams>(
    () => ({
      platform_id: selectedPlatform || undefined,
      follower_range_id: selectedFollowers || undefined,
      engagement_rate_id: selectedEngagement || undefined,
      fame_level_id: selectedFameLevel || undefined,
      content_type_id: selectedContentType || undefined,
      search: searchQuery.trim() || undefined,
    }),
    [
      searchQuery,
      selectedContentType,
      selectedEngagement,
      selectedFameLevel,
      selectedFollowers,
      selectedPlatform,
    ],
  );

  const discoveryQuery = useInfluencerDiscoveryQuery(discoveryParams);
  const influencers = discoveryQuery.data?.data ?? [];

  const withAllOption = (options: FilterOption[]) => [
    { label: allLabel, value: "" },
    ...options,
  ];

  const filterConfigs: Array<{
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }> = [
    {
      key: "platform_id",
      label: t("exploreInfluencers.platform"),
      value: selectedPlatform,
      onChange: setSelectedPlatform,
      options: withAllOption(
        platformsQuery.data?.map((platform) => ({
          label: t(`masterData.platforms.${platform.id}`, platform.label),
          value: platform.id.toString(),
        })) ?? [],
      ),
    },
    {
      key: "follower_range_id",
      label: t("exploreInfluencers.followers"),
      value: selectedFollowers,
      onChange: setSelectedFollowers,
      options: withAllOption(
        followerRangesQuery.data?.map((range) => ({
          label: t(`masterData.followerRanges.${range.id}`, range.label),
          value: range.id.toString(),
        })) ?? [],
      ),
    },
    {
      key: "engagement_rate_id",
      label: t("exploreInfluencers.engagement"),
      value: selectedEngagement,
      onChange: setSelectedEngagement,
      options: withAllOption([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
      ]),
    },
    {
      key: "fame_level_id",
      label: t("exploreInfluencers.fameLevel"),
      value: selectedFameLevel,
      onChange: setSelectedFameLevel,
      options: withAllOption([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
      ]),
    },
    {
      key: "content_type_id",
      label: t("exploreInfluencers.category"),
      value: selectedContentType,
      onChange: setSelectedContentType,
      options: withAllOption(
        contentTypesQuery.data?.map((type) => ({
          label: t(`masterData.contentTypes.${type.id}`, type.label),
          value: type.id.toString(),
        })) ?? [],
      ),
    },
  ];

  const resetFilters = () => {
    setSelectedPlatform("");
    setSelectedFollowers("");
    setSelectedEngagement("");
    setSelectedFameLevel("");
    setSelectedContentType("");
  };

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const params = {
          search: searchQuery.trim() || undefined,
          platform_id: selectedPlatform || undefined,
          follower_range_id: selectedFollowers || undefined,
          engagement_rate_id: selectedEngagement || undefined,
          fame_level_id: selectedFameLevel || undefined,
          content_type_id: selectedContentType || undefined,
        };

        await axios.get("/api/influencer-discovery", {
          params,
        });

      } catch (error) {
        console.error("Error fetching influencers:", error);
      }
    };

    fetchInfluencers();
  }, [
    searchQuery,
    selectedPlatform,
    selectedFollowers,
    selectedEngagement,
    selectedFameLevel,
    selectedContentType,
  ]);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-[#f3f3f1]">
      <div className="relative h-64 overflow-hidden sm:h-60 lg:h-64">
        <img src={hero} alt="hero" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 -mt-10 rounded-t-[34px] bg-[#f3f3f1] px-4 pb-12 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
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
                  "h-11 rounded-full border-[#e3dfd5] bg-white px-9 shadow-none",
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
                      <DropdownMenuRadioItem
                        key={`${filter.key}-${option.value || "all"}`}
                        value={option.value}>
                        {option.label}
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
                  {t("exploreInfluencers.resetFilters", "Reset filters")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Error */}
          {discoveryQuery.isError ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="px-6 py-5 text-center text-sm font-medium text-destructive">
                {t(
                  "exploreInfluencers.loadError",
                  "Could not load influencers. Please try again.",
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Loading */}
          {discoveryQuery.isLoading ? (
            <Card className="border-0 bg-transparent py-0 shadow-none">
              <CardContent className="px-6 py-12 text-center text-sm text-[#6f6e67]">
                {t("exploreInfluencers.loading", "Loading influencers...")}
              </CardContent>
            </Card>
          ) : null}

          {/* Grid */}
          {!discoveryQuery.isLoading && influencers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {influencers.map((item) => (
                <InfluencerCard key={item.id} item={item} isRTL={isRTL} />
              ))}
            </div>
          ) : null}

          {/* Empty state */}
          {!discoveryQuery.isLoading && influencers.length === 0 ? (
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
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ExploreInfluencers;
