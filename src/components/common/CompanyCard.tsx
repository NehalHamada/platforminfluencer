import { Card, CardContent } from "@/components/ui/card";

import LogoIcon from "./LogoIcon";

type CompanyCardProps = {
  name: string;
  sub: string;
  icon: string;
};

function CompanyCard({ name, sub, icon }: CompanyCardProps) {
  return (
    <Card className="min-w-65 rounded-2xl border-0 bg-white/70 py-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-0 backdrop-blur-sm">
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <LogoIcon type={icon} />

        <div>
          <h3 className="text-[20px] font-semibold uppercase leading-none text-[rgba(111,66,193,1)]">
            {name}
          </h3>
          <p className="mt-2 text-[14px] leading-none text-[rgba(111,66,193,0.6)]">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CompanyCard;
