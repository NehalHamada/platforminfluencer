import { CalendarDays, Check, MessageCircleMore } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import hero from "/assets/Hero.png";
import { useCampaignRequestsQuery } from "@/queries/campaigns/useCampaignsRequestQuery";

type CampaignStep = {
  id: number;
  label: string;
};

function CampaignsInf() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { campaignId: campaignIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = campaignIdParam ?? searchParams.get("campaignId");
  const applicationsQuery = useCampaignRequestsQuery();

  const steps: CampaignStep[] = [
    {
      id: 1,
      label: t("campaign.agreementDone"),
    },
    {
      id: 2,
      label: t("campaign.contentApproved"),
    },
    {
      id: 3,
      label: t("campaign.contentPosted"),
    },
  ];

  const selectedApplication =
    applicationsQuery.data?.data.find((application) =>
      campaignId
        ? String(application.campaign?.id ?? application.campaign_id) ===
          String(campaignId)
        : ["accepted", "content_approved"].indexOf(application.status) !== -1,
    ) ?? applicationsQuery.data?.data[0];

  const selectedCampaign = selectedApplication?.campaign;
  const rawCampaign = (selectedCampaign ?? {}) as Record<string, unknown>;
  const user = selectedCampaign?.user;
  const campaign = selectedApplication
    ? {
        id: String(selectedCampaign?.id ?? selectedApplication.campaign_id ?? ""),
        date:
          selectedApplication.execution_date ||
          selectedCampaign?.execution_time?.name ||
          selectedCampaign?.executionTime?.name ||
          selectedCampaign?.created_at ||
          "",
        title:
          selectedCampaign?.name ||
          selectedCampaign?.campaign_type?.name ||
          selectedCampaign?.campaignType?.name ||
          selectedCampaign?.campaign_type_name ||
          selectedCampaign?.idea ||
          "-",
        company:
          user?.company_name ||
          selectedCampaign?.company_name ||
          (rawCampaign.brand_name as string | undefined) ||
          user?.name ||
          "-",
        reservedAmount: selectedApplication.price
          ? String(selectedApplication.price)
          : selectedCampaign?.budget_range?.name ||
            selectedCampaign?.budgetRange?.name ||
            selectedCampaign?.budget_range_name ||
            "-",
        commission: "-",
        influencerNet: selectedApplication.price
          ? String(selectedApplication.price)
          : "-",
        completedText:
          selectedApplication.status === "content_approved"
            ? t(
                "campaign.contentApproved",
                "Content approved and waiting for settlement",
              )
            : t("campaign.chatAvailable", "Chat available"),
      }
    : null;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-white">
      <div className="relative h-52 w-full overflow-hidden sm:h-85">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <h1
          className={`absolute bottom-5 block text-[11px] font-semibold text-white sm:hidden ${
            isRTL ? "right-4" : "left-4"
          }`}>
          تفاصيل حملتك
        </h1>
      </div>

      <div className="relative z-10 -mt-1 bg-white px-3 pb-24 pt-0 sm:-mt-10 sm:rounded-t-[34px] sm:bg-[#f7f6f2] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <div className="bg-white p-0 shadow-none sm:rounded-[28px] sm:p-6 sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)] lg:p-8">
            <div className="rounded-none bg-white p-0 sm:rounded-[22px] sm:bg-[#fbfaf7] sm:p-5 lg:p-6">
              <div
                className={`mb-4 flex flex-row-reverse items-center justify-between gap-2 border-b border-[#f0eee8] px-1 py-3 sm:mb-5 sm:gap-3 sm:border-[#eceae2] sm:px-0 sm:pb-4 sm:pt-0 sm:flex-row sm:items-center sm:justify-between ${
                  isRTL ? "sm:flex-row-reverse" : "sm:flex-row-reverse"
                }`}>
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 ${
                    isRTL ? "flex-row-reverse" : "flex-row-reverse"
                  }`}>
                  <span className="inline-flex rounded-sm bg-[#9baa87] px-3 py-1.5 text-[11px] font-medium text-white sm:rounded-md sm:bg-[#262626] sm:px-3 sm:py-1.5 sm:text-xs">
                    {t("campaign.chatAvailable")}
                  </span>
                  <MessageCircleMore className="hidden h-3 w-3 text-[#979b90] sm:block sm:h-4 sm:w-4" />
                </div>

                <div
                  className={`flex items-center gap-1.5 text-[11px] text-[#6e7267] sm:gap-2 sm:text-sm ${
                    isRTL ? "flex-row-reverse" : "flex-row-reverse"
                  }`}>
                  <CalendarDays className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span>{campaign?.date ?? "-"}</span>
                </div>
              </div>

              {applicationsQuery.isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8c99a] border-t-transparent" />
                </div>
              ) : !campaign ? (
                <div className="py-16 text-center text-sm text-[#8b8b8b]">
                  {t("campaign.empty", "No campaign data available")}
                </div>
              ) : (
                <>
              <div className="grid grid-cols-1 gap-5 px-1 sm:gap-8 sm:px-0 lg:grid-cols-[0.85fr_1.15fr]">
                <div className={isRTL ? "text-right" : "text-left"}>
                  <div
                    className={`mb-3 flex flex-col items-start gap-1 sm:mb-5 sm:flex-row sm:items-center sm:gap-3 ${
                      isRTL
                        ? "sm:flex-row-reverse sm:justify-end"
                        : "sm:flex-row-reverse sm:justify-end"
                    }`}>
                    <span className="order-2 self-center inline-flex rounded-sm bg-[#39b54a] px-4 py-1.5 text-[12px] font-medium text-white sm:order-0 sm:self-auto sm:rounded-md sm:px-4 sm:py-1.5 sm:text-sm">
                      {t("campaign.campaignCompleted")}
                    </span>
                    <p className="text-sm leading-7 text-[#4f5049] sm:text-[15px] sm:leading-7">
                      <span className="font-semibold text-[#292924]">
                        {t("campaign.campaignName")} :
                      </span>{" "}
                      {campaign.title}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm leading-7 text-[#4f5049] sm:space-y-3 sm:text-[15px] sm:leading-7">
                    <p>
                      <span className="font-semibold text-[#292924]">
                        {t("campaign.companyName")} :
                      </span>{" "}
                      {campaign.company}
                    </p>
                    <div>
                      <p className="font-semibold text-[#292924]">
                        {t("campaign.paymentDetails")} :
                      </p>
                      <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1">
                        <li>
                          <span className="font-semibold text-[#3f3f39]">
                            {t("campaign.reservedAmount")} :
                          </span>{" "}
                          {campaign.reservedAmount}
                        </li>
                        <li>
                          <span className="font-semibold text-[#3f3f39]">
                            {t("campaign.commission")} :
                          </span>{" "}
                          {campaign.commission}
                        </li>
                        <li>
                          <span className="font-semibold text-[#3f3f39]">
                            {t("campaign.influencerNet")} :
                          </span>{" "}
                          {campaign.influencerNet}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="order-first relative sm:order-0 lg:pt-1">
                  <div
                    className={`hidden sm:absolute sm:top-3 sm:bottom-3 sm:block sm:w-px sm:h-30 sm:bg-[#dbd7ec] ${
                      isRTL ? "left-2" : "right-2"
                    }`}
                  />
                  <div className="relative flex items-start justify-between gap-2 pb-2 sm:block sm:space-y-10">
                    <div
                      className="absolute left-5 right-5 top-1 h-px bg-[#d8dccb] sm:hidden"
                      aria-hidden="true"
                    />
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`relative flex flex-1 flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 ${
                          isRTL ? "sm:flex-row-reverse" : "sm:flex-row-reverse"
                        }`}>
                        <div className="relative z-10 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#9baa87] text-white sm:h-4 sm:w-4 sm:bg-[#8f8cb0]">
                          <Check
                            className="hidden h-2.5 w-2.5 sm:block"
                            strokeWidth={3}
                          />
                        </div>
                        <p
                          className={`text-center text-[11px] font-medium text-[#62665d] sm:text-[15px] ${
                            isRTL ? "sm:text-left" : "sm:text-left"
                          }`}>
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-full bg-[#eef2ef] px-4 py-2.5 text-center text-xs leading-5 text-[#595c55] sm:mt-8 sm:rounded-[12px] sm:px-4 sm:py-4 sm:text-sm">
                {campaign.completedText}
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignsInf;
