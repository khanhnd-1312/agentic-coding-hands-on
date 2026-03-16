"use client";

import { useState } from "react";
import { getStarCount } from "@/types/kudos";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";
import type { LanguagePreference } from "@/types/login";

interface StarCountProps {
	kudosReceivedCount: number;
	lang?: LanguagePreference;
}

export function StarCount({ kudosReceivedCount, lang = "vi" }: StarCountProps) {
	const [showTooltip, setShowTooltip] = useState(false);
	const stars = getStarCount(kudosReceivedCount);
	const t = kudosLiveBoardDictionary[lang].star;

	if (stars === 0) return null;

	const starText = "★".repeat(stars);
	const tooltipText =
		stars === 1 ? t.tooltip1 : stars === 2 ? t.tooltip2 : t.tooltip3;

	return (
		<span
			className="relative inline-flex items-center text-[var(--klb-color-accent-gold)] text-sm cursor-help"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
			aria-label={tooltipText}
		>
			{starText}
			{showTooltip && (
				<span
					role="tooltip"
					className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs font-normal text-white bg-[#1a2a36] rounded-lg shadow-lg z-10 whitespace-normal"
				>
					{tooltipText}
				</span>
			)}
		</span>
	);
}
