import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";
import { cn } from "@/lib/utils";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";

function CampaignsRequests() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const requestsQuery = useCampaignRequestsQuery();
  const requests = requestsQuery.data?.data ?? [];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-[#efefeb]">
      <div className="relative h-44 w-full overflow-hidden sm:h-64 lg:h-72">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 -mt-1 rounded-t-[10px] bg-[#f7f6f2] px-2 pb-20 pt-4 sm:-mt-12 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center sm:mb-8">
            <h1 className="text-[12px] font-semibold text-[#20201d] sm:text-3xl">
              {t("campaignsRequest.title")}
            </h1>
            <p className="mx-auto mt-2 max-w-44 text-[8px] leading-4 text-[#707068] sm:mt-3 sm:max-w-2xl sm:text-base sm:leading-normal">
              {t("campaignsRequest.description")}
            </p>
          </div>

          <div className="bg-transparent p-0 shadow-none sm:rounded-[30px] sm:bg-white/90 sm:p-6 sm:shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  className="rounded-[4px] border border-[#ece9e1] bg-white py-0 shadow-none sm:rounded-xl sm:shadow-sm">
                  <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-center justify-between gap-2 sm:gap-3",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}>
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                        <AvatarImage src={request.image} alt={request.name} />
                        <AvatarFallback>{request.name[0]}</AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          "flex-1",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <p className="text-[9px] font-medium text-[#2e2e29] sm:text-sm">
                          {request.name}
                        </p>
                        <p className="text-[7px] text-[#8b8b8b] sm:text-xs">
                          {request.title || t("campaignsRequest.creatorLabel")}
                        </p>
                      </div>

                      <Badge className="bg-[#eef2e6] px-1.5 py-1 text-[#8b9677] sm:px-2.5">
                        <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Badge>
                    </div>

                    {/* Platforms */}
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                        {isRTL ? "المنصات :" : "Platforms:"}
                      </p>

                      <div className="mt-2 grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-2">
                        {request.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="secondary"
                            className="justify-center rounded-sm bg-[#f7f7f4] px-2 py-1 text-[8px] font-normal text-[#55554f] shadow-none sm:rounded-full sm:text-xs">
                            {platform}
                          </Badge>
                        ))}
                        {request.platforms.length === 0 ? (
                          <Badge
                            variant="secondary"
                            className="justify-center rounded-sm bg-[#f7f7f4] px-2 py-1 text-[8px] font-normal text-[#55554f] shadow-none sm:rounded-full sm:text-xs">
                            -
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    {/* Followers */}
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                        {t("campaignsRequest.followers")}:
                      </p>
                      <p className="text-[9px] text-[#55554f] sm:text-sm">
                        {request.followers}
                      </p>
                    </div>

                    {/* Price */}
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[9px] font-semibold text-[#2d2d28] sm:text-sm">
                        {t("campaignsRequest.requestedPrice")}:
                      </p>
                      <p className="text-[9px] text-[#55554f] sm:text-sm">
                        {request.requestedPrice}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="grid grid-cols-2 border-t border-[#f0eee8] p-0">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 gap-1 text-[9px] text-[#70b46b] hover:bg-[#f6fbf4] sm:h-11 sm:text-sm">
                      {t("campaignsRequest.accept")}
                      <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 gap-1 text-[9px] text-[#ff5d5d] hover:bg-[#fff8f8] sm:h-11 sm:text-sm">
                      {t("campaignsRequest.reject")}
                      <CircleX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignsRequests;
