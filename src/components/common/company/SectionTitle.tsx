import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left" | "right";
};

function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
}: SectionTitleProps) {
  return (
    <header
      className={cn(
        "mb-4",
        align === "center" && "text-center",
        align === "left" && "text-left",
        align === "right" && "text-right",
        className,
      )}>
      <h2 className="text-[15px] font-bold text-[#222222]">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-[9px] leading-4 text-[#8b8b8b]">{subtitle}</p>
      ) : null}
    </header>
  );
}

export default SectionTitle;
