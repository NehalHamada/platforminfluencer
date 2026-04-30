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
import type { InfluencerDiscoveryQueryParams } from "@/types/dashboard.types";
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

type FilterOption = {
  label: string;
  value: string;
};

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
      label: t("exploreInfluencers.fameLevel", "Fame Level"),
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

          {discoveryQuery.isLoading ? (
            <Card className="border-0 bg-transparent py-0 shadow-none">
              <CardContent className="px-6 py-12 text-center text-sm text-[#6f6e67]">
                {t("exploreInfluencers.loading", "Loading influencers...")}
              </CardContent>
            </Card>
          ) : null}

          {!discoveryQuery.isLoading && influencers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {influencers.map((item) => (
                <Card key={item.id} className="group transition hover:shadow-md">
                  <CardContent className="flex gap-4 p-4">
                    <div className="flex flex-1 flex-col justify-between space-y-3">
                      <div
                        className={cn(
                          "flex items-start justify-between",
                          isRTL && "flex-row-reverse",
                        )}>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <h3 className="text-sm font-semibold">
                            {item.name}
                          </h3>
                          {item.platform ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.platform}
                            </p>
                          ) : null}
                        </div>

                        <Button size="icon" variant="ghost">
                          <Bookmark size={16} />
                        </Button>
                      </div>

                      <div
                        className={cn(
                          "flex items-center gap-6 text-sm",
                          isRTL && "flex-row-reverse",
                        )}>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            {t("exploreInfluencers.followersLabel")}
                          </p>
                          <p className="font-semibold">{item.followers || "-"}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            {t("exploreInfluencers.engagementLabel")}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">
                              {item.engagement || "-"}
                            </span>
                            <Star className="h-3 w-3 fill-primary text-primary" />
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {item.category || item.audience || "-"}
                      </p>

                      <div className="flex flex-wrap gap-2">
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

                    <div className="relative w-28 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

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
