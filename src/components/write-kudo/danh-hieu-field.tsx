"use client";

interface DanhHieuFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const MAX_LENGTH = 50;

export function DanhHieuField({
  value,
  onChange,
  error,
}: DanhHieuFieldProps) {
  const remaining = MAX_LENGTH - value.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <label className="w-[139px] shrink-0 font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#00101A]">
          Danh hiệu
          <span className="text-[#E46060]">*</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Dành tặng một danh hiệu cho đồng đội"
          className={`h-14 flex-1 rounded-lg border bg-white px-6 py-4 font-[family-name:var(--font-montserrat)] text-base font-bold text-[#00101A] outline-none placeholder:text-[#999] ${
            error ? "border-[#E46060]" : "border-[#998C5F]"
          }`}
        />
      </div>
      <div className="ml-[155px] font-[family-name:var(--font-montserrat)] text-[16px] font-bold leading-[24px] text-[#999]">
        <p>Ví dụ: Người truyền động lực cho tôi.</p>
        <p>Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.</p>
      </div>
      {error && (
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-[#E46060]">
          {error}
        </p>
      )}
    </div>
  );
}
