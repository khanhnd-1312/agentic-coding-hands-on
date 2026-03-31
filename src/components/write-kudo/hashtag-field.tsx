"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
interface Hashtag {
  id: string;
  name: string;
}

interface HashtagFieldProps {
  selectedHashtags: Array<{ id: string; name: string }>;
  onChange: (hashtags: Array<{ id: string; name: string }>) => void;
  error?: string;
}

const MAX_HASHTAGS = 5;

export function HashtagField({
  selectedHashtags,
  onChange,
  error,
}: HashtagFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allHashtags, setAllHashtags] = useState<Hashtag[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchHashtags = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hashtags");
      if (res.ok) {
        const json = (await res.json()) as { data: Hashtag[] };
        setAllHashtags(json.data ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openDropdown = () => {
    setIsOpen(true);
    setFilter("");
    fetchHashtags();
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedIds = new Set(selectedHashtags.map((h) => h.id));

  // Show ALL hashtags (selected + unselected) matching filter — per Figma, selected items stay visible with check icon
  const visibleHashtags = allHashtags.filter((h) =>
    h.name.toLowerCase().includes(filter.toLowerCase())
  );
  const unselectedVisible = visibleHashtags.filter((h) => !selectedIds.has(h.id));

  const exactMatch = allHashtags.some(
    (h) => h.name.toLowerCase() === filter.trim().toLowerCase()
  );

  const selectHashtag = (hashtag: Hashtag) => {
    if (selectedHashtags.length >= MAX_HASHTAGS) return;
    if (selectedIds.has(hashtag.id)) return;
    onChange([...selectedHashtags, hashtag]);
    setFilter("");
    if (selectedHashtags.length + 1 >= MAX_HASHTAGS) {
      setIsOpen(false);
    }
  };

  const removeHashtag = (id: string) => {
    onChange(selectedHashtags.filter((h) => h.id !== id));
  };

  const createAndSelect = async () => {
    const name = filter.trim();
    if (!name || selectedHashtags.length >= MAX_HASHTAGS) return;
    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: Hashtag };
        const created: Hashtag = json.data;
        if (!selectedIds.has(created.id)) {
          onChange([...selectedHashtags, created]);
        }
        setFilter("");
        setAllHashtags((prev) =>
          prev.some((h) => h.id === created.id) ? prev : [...prev, created]
        );
        if (selectedHashtags.length + 1 >= MAX_HASHTAGS) {
          setIsOpen(false);
        }
      }
    } catch {
      // silently fail
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const firstUnselected = visibleHashtags.find((h) => !selectedIds.has(h.id));
      if (firstUnselected) {
        selectHashtag(firstUnselected);
      } else if (filter.trim() && !exactMatch) {
        createAndSelect();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="shrink-0 font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#00101A]">
          Hashtag
          <span className="text-[#E46060]">*</span>
        </label>

        {selectedHashtags.map((hashtag) => (
          <span
            key={hashtag.id}
            className="flex h-8 items-center gap-1 rounded-full border border-[#998C5F] bg-white px-3 text-sm font-bold text-[#00101A]"
          >
            {hashtag.name}
            <button
              type="button"
              onClick={() => removeHashtag(hashtag.id)}
              className="ml-1 flex items-center justify-center"
            >
              <Icon name="close" size={12} className="text-[#999]" />
            </button>
          </span>
        ))}

        {selectedHashtags.length < MAX_HASHTAGS && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={openDropdown}
              className={`flex h-12 flex-col items-center justify-center rounded-lg border bg-white px-2 py-1 ${error ? "border-[#E46060]" : "border-[#998C5F]"}`}
            >
              <span className="flex items-center gap-1 text-sm font-bold text-[#00101A]">
                <Icon name="plus" size={16} className="text-[#00101A]" />
                Hashtag
              </span>
              <span className="text-xs text-[#999]">
                T&#7889;i &#273;a {MAX_HASHTAGS}
              </span>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-79.5 max-md:w-full rounded-lg border border-[#998C5F] bg-[#00070C] p-1.5 shadow-lg">
                <div className="border-b border-[#998C5F] p-2 bg-[#00070C]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm hoặc tạo hashtag..."
                    className="w-full border-none bg-transparent px-1 py-1 text-base font-bold text-white outline-none placeholder:text-[#999]"
                  />
                </div>
                <ul role="listbox" aria-multiselectable="true" aria-label="Chọn hashtag" className="max-h-80 overflow-y-auto">
                  {isLoading && (
                    <li className="px-4 h-10 flex items-center text-base font-bold text-white/50">
                      Đang tải...
                    </li>
                  )}
                  {!isLoading &&
                    visibleHashtags.map((hashtag) => {
                      const isSelected = selectedIds.has(hashtag.id);
                      const isDisabled = !isSelected && selectedHashtags.length >= MAX_HASHTAGS;
                      return (
                        <li key={hashtag.id} role="option" aria-selected={isSelected}>
                          <button
                            type="button"
                            onClick={() => isSelected ? removeHashtag(hashtag.id) : selectHashtag(hashtag)}
                            disabled={isDisabled}
                            className={[
                              "w-full h-10 px-4 flex items-center justify-between text-left text-base font-bold leading-6 tracking-[0.15px] text-white transition-colors duration-150",
                              "focus-visible:outline-2 focus-visible:outline-[#15D5CA] focus-visible:-outline-offset-2",
                              isSelected ? "bg-[rgba(255,234,158,0.2)] rounded-sm" : "hover:bg-[rgba(255,234,158,0.1)]",
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                            ].filter(Boolean).join(" ")}
                          >
                            <span className="truncate">{hashtag.name}</span>
                            {isSelected && <Icon name="check-circle" size={24} className="text-white shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  {!isLoading &&
                    filter.trim() &&
                    !exactMatch &&
                    unselectedVisible.length === 0 && (
                      <li>
                        <button
                          type="button"
                          onClick={createAndSelect}
                          className="w-full h-10 px-4 flex items-center text-left text-base font-bold text-[#998C5F] hover:bg-[rgba(255,234,158,0.1)] transition-colors duration-150"
                        >
                          + Tạo &ldquo;{filter.trim()}&rdquo;
                        </button>
                      </li>
                    )}
                  {!isLoading &&
                    filter.trim() &&
                    !exactMatch &&
                    unselectedVisible.length > 0 && (
                      <li className="border-t border-[#998C5F]/20">
                        <button
                          type="button"
                          onClick={createAndSelect}
                          className="w-full h-10 px-4 flex items-center text-left text-base font-bold text-[#998C5F] hover:bg-[rgba(255,234,158,0.1)] transition-colors duration-150"
                        >
                          + Tạo &ldquo;{filter.trim()}&rdquo;
                        </button>
                      </li>
                    )}
                  {!isLoading && visibleHashtags.length === 0 && !filter.trim() && (
                    <li className="px-4 h-10 flex items-center text-base font-bold text-white/50">
                      Không có dữ liệu
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-[#E46060]">
          {error}
        </p>
      )}
    </div>
  );
}
