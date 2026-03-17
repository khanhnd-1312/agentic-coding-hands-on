"use client";

import { Icon } from "@/components/ui/icon";

interface AnonymousToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AnonymousToggle({
  checked,
  onChange,
}: AnonymousToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E] ${
          checked
            ? "border-[#FFEA9E] bg-[#FFEA9E]"
            : "border-[#998C5F] bg-transparent"
        }`}
      >
        {checked && (
          <Icon name="checkbox-checked" size={20} className="text-[#00101A]" />
        )}
      </button>
      <label
        onClick={() => onChange(!checked)}
        className="cursor-pointer font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#999]"
      >
        {"Gửi lời cám ơn và ghi nhận ẩn danh"}
      </label>
    </div>
  );
}
