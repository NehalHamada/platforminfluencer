import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Controller,
  type Control,
  type FieldError,
  type Path,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import type { CampaignSchema } from "@/schema/campaign.schema";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  name: Path<CampaignSchema>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  control: Control<CampaignSchema>;
  error?: FieldError;
  isRTL: boolean;
};

function SelectField({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  isRTL,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const fieldId = `select-field-${String(name)}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={fieldId}
        className={cn(
          "text-md font-medium text-[#2f2f2b]",
          isRTL ? "text-right" : "text-left",
        )}>
        {label}
      </Label>

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id={fieldId}
              title={label}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "h-11 w-full appearance-none rounded-full border bg-white px-4 text-sm outline-none transition focus:border-[#a7b58f] focus-visible:ring-2 focus-visible:ring-[#a7b58f]/30",
                error
                  ? "border-red-400 text-red-600"
                  : "border-[#d8d8d3] text-[#5f5f59]",
                isRTL ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left",
              )}>
              <option value="" disabled>
                {placeholder}
              </option>

              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#7f7f77]",
            isRTL ? "left-4" : "right-4",
          )}
        />
      </div>

      {error ? (
        <p
          id={errorId}
          className={cn(
            "text-xs text-red-500",
            isRTL ? "text-right" : "text-left",
          )}>
          {t(error.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}

export default SelectField;
