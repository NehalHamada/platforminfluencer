import { Eye, Heart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import type { FeaturedInfluencer } from "@/types/dashboard.types";

type SmallInfluencerCardProps = {
  item: FeaturedInfluencer;
};

function SmallInfluencerCard({ item }: SmallInfluencerCardProps) {
  return (
    <Card className="overflow-hidden rounded-[8px] border-0 bg-white py-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-0">
      <img
        src={item.image}
        alt={item.name}
        className="h-19.5 w-full rounded-t-[8px] object-cover"
      />

      <CardContent className="px-2 pb-2 pt-1.5 text-right">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[6px] text-[#999999]">{item.category}</p>
          <p className="truncate text-[7px] font-semibold text-[#2f2f2f]">
            {item.name}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between text-[#757575]">
          <div className="flex items-center gap-1 text-[6px]">
            <Heart className="h-2.5 w-2.5" aria-hidden="true" />
            <span>{item.engagement}</span>
          </div>
          <div className="flex items-center gap-1 text-[6px]">
            <Eye className="h-2.5 w-2.5" aria-hidden="true" />
            <span>{item.followers}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 h-auto w-full rounded-[5px] border-[#dcdcdc] bg-white py-1 text-[6px] text-[#4e4e4e] hover:bg-[#f8f8f8]">
          عرض الملف
        </Button>
      </CardContent>
    </Card>
  );
}

export default SmallInfluencerCard;
