"use client";

import { useState, useMemo } from "react";
import type { SpotlightEntry } from "@/types/kudos";

interface SpotlightBoardProps {
	entries: SpotlightEntry[];
	searchPlaceholder: string;
	panZoomTooltip: string;
}

const SIZE_CLASSES = [
	{ min: 0.75, className: "text-[11.34px] font-bold" },
	{ min: 0.5, className: "text-[10.92px] font-medium" },
	{ min: 0.25, className: "text-[10.21px] font-bold" },
	{ min: 0, className: "text-[7.94px] font-bold" },
] as const;

function getSizeClass(ratio: number): string {
	for (const tier of SIZE_CLASSES) {
		if (ratio >= tier.min) return tier.className;
	}
	return SIZE_CLASSES[SIZE_CLASSES.length - 1].className;
}

export function SpotlightBoard({
	entries,
	searchPlaceholder,
	panZoomTooltip,
}: SpotlightBoardProps) {
	const [search, setSearch] = useState("");
	const [panZoomEnabled, setPanZoomEnabled] = useState(false);

	const maxCount = useMemo(
		() => Math.max(...entries.map((e) => e.kudos_count), 1),
		[entries],
	);

	const normalizedSearch = search.toLowerCase().trim();

	return (
		<div
			aria-label="Spotlight Board — interactive word cloud of kudos recipients"
			className="relative w-full border border-[var(--klb-color-accent-gold)] rounded-lg overflow-hidden bg-[var(--klb-color-bg-card)]"
		>
			{/* Search + controls */}
			<div className="flex items-center gap-3 p-4">
				<input
					type="text"
					placeholder={searchPlaceholder}
					maxLength={100}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 bg-transparent text-[var(--klb-color-text-white)] placeholder:text-[var(--klb-color-text-muted)] text-sm outline-none"
				/>
				<button
					type="button"
					onClick={() => setPanZoomEnabled((prev) => !prev)}
					aria-pressed={panZoomEnabled}
					className="text-[var(--klb-color-text-white)] text-sm font-medium whitespace-nowrap"
				>
					{panZoomTooltip}
				</button>
			</div>

			{/* Word cloud area */}
			<div className="flex flex-wrap items-center justify-center gap-3 p-6 min-h-[400px]">
				{entries.map((entry) => {
					const ratio = entry.kudos_count / maxCount;
					const sizeClass = getSizeClass(ratio);
					const isMatch =
						normalizedSearch.length > 0 &&
						entry.name.toLowerCase().includes(normalizedSearch);

					return (
						<span
							key={entry.user_id}
							className={`
								font-[family-name:var(--font-montserrat)]
								transition-all duration-150 ease-out
								cursor-pointer
								hover:opacity-80 hover:scale-110
								${sizeClass}
								${
									isMatch
										? "text-[var(--klb-color-highlight-pink)]"
										: "text-[var(--klb-color-text-white)]"
								}
							`}
						>
							{entry.name}
						</span>
					);
				})}
			</div>
		</div>
	);
}
