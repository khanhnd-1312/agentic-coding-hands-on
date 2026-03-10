"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import type { LanguagePreference } from "@/types/login";

interface LanguageSelectorProps {
	lang: LanguagePreference;
	onLangChange: (lang: LanguagePreference) => void;
}

const LANG_OPTIONS: { value: LanguagePreference; label: string }[] = [
	{ value: "vi", label: "Tiếng Việt (VI)" },
	{ value: "en", label: "English (EN)" },
];

export function LanguageSelector({ lang, onLangChange }: LanguageSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const label = lang === "vi" ? "VN" : "EN";

	const close = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close]);

	function handleSelect(value: LanguagePreference) {
		document.cookie = `lang=${value}; path=/; max-age=31536000`;
		onLangChange(value);
		setIsOpen(false);
	}

	return (
		<div className="w-[108px] h-14 flex items-center gap-4 relative">
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label="Select language"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex items-center justify-between p-4 rounded-sm hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.12)] focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2 transition-colors duration-150 ease-in-out"
			>
				<Icon name="flag-vn" size={24} />
				<span className="text-white text-base font-bold tracking-[0.15px] mx-1">
					{label}
				</span>
				<Icon name="chevron-down" size={16} />
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-[99]"
						aria-hidden="true"
						onClick={close}
					/>

					{/* Dropdown */}
					<ul
						role="listbox"
						aria-label="Select language"
						className="absolute top-full right-0 mt-1 bg-[rgba(11,15,18,0.95)] border border-[#2E3940] rounded-md z-[100] min-w-[140px] overflow-hidden transition-[opacity,transform] duration-150 ease-out"
					>
						{LANG_OPTIONS.map(({ value, label: optLabel }) => (
							<li
								key={value}
								role="option"
								aria-selected={lang === value}
								onClick={() => handleSelect(value)}
								className={[
									"px-4 py-3 cursor-pointer text-white text-sm font-bold",
									"hover:bg-[rgba(255,255,255,0.08)]",
									lang === value ? "text-[#15D5CA]" : "",
								]
									.filter(Boolean)
									.join(" ")}
							>
								{optLabel}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
