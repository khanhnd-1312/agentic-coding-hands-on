"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import type { SpotlightEntry } from "@/types/kudos";

interface SpotlightBoardProps {
	entries: SpotlightEntry[];
	totalKudos: number;
	searchPlaceholder: string;
	panZoomTooltip: string;
}

const SIZE_CLASSES = [
	{ min: 0.75, className: "text-[11.34px] font-bold leading-[6.36px] tracking-[0.208px]" },
	{ min: 0.5, className: "text-[10.92px] font-medium leading-[16.38px] tracking-[0.102px]" },
	{ min: 0.25, className: "text-[10.21px] font-bold leading-[6.36px] tracking-[0.208px]" },
	{ min: 0, className: "text-[7.94px] font-bold leading-[6.36px] tracking-[0.208px]" },
] as const;

function getSizeClass(ratio: number): string {
	for (const tier of SIZE_CLASSES) {
		if (ratio >= tier.min) return tier.className;
	}
	return SIZE_CLASSES[SIZE_CLASSES.length - 1].className;
}

export function SpotlightBoard({
	entries,
	totalKudos,
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
			className="relative w-full border border-[var(--klb-color-border-gold)] rounded-lg overflow-hidden"
			style={{ background: "linear-gradient(180deg, #0a1520 0%, #00101a 100%)" }}
		>
			{/* Header: total kudos + search + pan/zoom */}
			<div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--klb-color-border-gold)]/30">
				<p className="text-[32px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] whitespace-nowrap">
					{totalKudos} KUDOS
				</p>

				<div className="flex items-center gap-3">
					{/* Search input */}
					<div className="flex items-center gap-2 border border-[var(--klb-color-border-gold)] rounded-lg px-3 py-1.5">
						<Icon
							name="search"
							size={16}
							className="text-[var(--klb-color-text-muted)] shrink-0"
						/>
						<input
							type="text"
							placeholder={searchPlaceholder}
							maxLength={100}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="bg-transparent text-[var(--klb-color-text-white)] placeholder:text-[var(--klb-color-text-muted)] text-sm outline-none w-32 lg:w-48"
						/>
					</div>

					{/* Pan/Zoom toggle */}
					<button
						type="button"
						onClick={() => setPanZoomEnabled((prev) => !prev)}
						aria-pressed={panZoomEnabled}
						title={panZoomTooltip}
						className={`p-2 rounded-lg border transition-colors ${
							panZoomEnabled
								? "border-[var(--klb-color-accent-gold)] text-[var(--klb-color-accent-gold)]"
								: "border-[var(--klb-color-border-gold)] text-[var(--klb-color-text-white)]"
						} hover:border-[var(--klb-color-accent-gold)] cursor-pointer`}
					>
						<Icon name="pan-zoom" size={20} className="text-current" />
					</button>
				</div>
			</div>

			{/* Word cloud area */}
			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 p-6 lg:p-8 min-h-[400px] lg:min-h-[480px]">
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
