import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LogoIconType = "puzzle" | "grid" | "wave" | "leaf" | "tool";

type LogoIconProps = {
  type?: LogoIconType | string;
  className?: string;
};

function LogoIcon({ type, className }: LogoIconProps) {
  const common = "text-[#b4baa5]";

  if (type === "puzzle") {
    return (
      <Card
        className={cn(
          "h-10 w-10 border-0 bg-transparent py-0 shadow-none ring-0",
          className,
        )}>
        <CardContent className={cn("relative h-10 w-10 p-0", common)}>
          <div className="absolute left-0 top-2 h-6 w-6 rounded-sm bg-current" />
          <div className="absolute right-0 top-2 h-4 w-4 rounded-full bg-current" />
          <div className="absolute bottom-0 left-2 h-4 w-4 rounded-full bg-current" />
        </CardContent>
      </Card>
    );
  }

  if (type === "grid") {
    return (
      <Card
        className={cn(
          "h-10 w-10 border-0 bg-transparent py-0 shadow-none ring-0",
          className,
        )}>
        <CardContent
          className={cn("grid h-10 w-10 grid-cols-2 gap-1 p-0", common)}>
          <div className="rounded-[3px] bg-current" />
          <div className="rounded-[3px] bg-current" />
          <div className="rounded-[3px] bg-current" />
          <div className="rounded-[3px] bg-current" />
        </CardContent>
      </Card>
    );
  }

  if (type === "wave") {
    return (
      <Card
        className={cn(
          "h-10 w-10 rounded-full border-0 bg-[#b4baa5] py-0 shadow-none ring-0",
          className,
        )}>
        <CardContent className="flex h-10 w-10 items-center justify-center p-0">
          <div className="flex gap-0.5">
            <span className="h-3 w-0.75 rounded-full bg-white/90" />
            <span className="h-5 w-0.75 rounded-full bg-white/90" />
            <span className="h-3 w-0.75 rounded-full bg-white/90" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "leaf") {
    return (
      <Card
        className={cn(
          "h-10 w-10 border-0 bg-transparent py-0 shadow-none ring-0",
          className,
        )}>
        <CardContent className="relative h-10 w-10 p-0">
          <div className="absolute left-1 top-1 h-8 w-8 rounded-full bg-[#b4baa5] opacity-90" />
          <div className="absolute left-4 top-2 h-5 w-2 rotate-45 rounded-full bg-white/70" />
        </CardContent>
      </Card>
    );
  }

  if (type === "tool") {
    return (
      <Card
        className={cn(
          "h-10 w-10 rounded-full border-0 bg-[#b4baa5] py-0 text-white shadow-none ring-0",
          className,
        )}>
        <CardContent className="flex h-10 w-10 items-center justify-center p-0">
          <span className="text-lg" aria-hidden="true">
            ⌁
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-10 w-10 rounded-full border-0 bg-[#b4baa5] py-0 shadow-none ring-0",
        className,
      )}>
      <CardContent className="h-10 w-10 p-0" />
    </Card>
  );
}

export default LogoIcon;
