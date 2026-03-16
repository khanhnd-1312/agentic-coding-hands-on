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
	{ min: 0.75, className: "text-[14px] font-bold" },
	{ min: 0.5, className: "text-[12px] font-medium" },
	{ min: 0.25, className: "text-[10px] font-bold" },
	{ min: 0, className: "text-[8px] font-bold" },
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

	// Build recent activity log from entries (simulated from top receivers)
	const activityLog = useMemo(() => {
		return entries
			.slice(0, 6)
			.map((e) => `08:30PM ${e.name} đã nhận được một Kudos mới`);
	}, [entries]);

	return (
		<div
			aria-label="Spotlight Board — interactive word cloud of kudos recipients"
			className="relative w-full border border-[var(--klb-color-border-gold)] rounded-lg overflow-hidden"
			style={{
				background: "linear-gradient(180deg, #0d1a24 0%, #00101a 100%)",
			}}
		>
			{/* SVG mesh background pattern */}
			<div
				className="absolute inset-0 opacity-10 pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 40 M 20 -10 L -10 20 M 50 30 L 30 50' stroke='%23998C5F' stroke-width='0.5' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23grid)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Top bar: Search (left) + "N KUDOS" (center) */}
			<div className="relative z-10 flex items-center justify-between p-4">
				{/* Search input — top-left */}
				<div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-48">
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
						className="bg-transparent text-[var(--klb-color-text-white)] placeholder:text-[var(--klb-color-text-muted)] text-sm outline-none w-full"
					/>
				</div>

				{/* "388 KUDOS" — top-center */}
				<p className="absolute left-1/2 -translate-x-1/2 text-[32px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] whitespace-nowrap">
					{totalKudos} KUDOS
				</p>

				{/* Spacer for right side */}
				<div className="w-48" />
			</div>

			{/* Word cloud area */}
			<div className="relative z-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-6 lg:px-10 py-4 min-h-[360px] lg:min-h-[440px]">
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

			{/* Bottom bar: Activity log (left) + Pan/Zoom (right) */}
			<div className="relative z-10 flex items-end justify-between p-4">
				{/* Activity log — bottom-left */}
				<div className="flex flex-col gap-0.5 max-w-[400px]">
					{activityLog.map((line, i) => (
						<p
							key={i}
							className="text-[10px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] truncate opacity-70"
						>
							{line}
						</p>
					))}
				</div>

				{/* Pan/Zoom toggle — bottom-right */}
				<div className="flex flex-col gap-1">
					<button
						type="button"
						onClick={() => setPanZoomEnabled((prev) => !prev)}
						aria-pressed={panZoomEnabled}
						title={panZoomTooltip}
						className={`p-1.5 rounded transition-colors cursor-pointer ${
							panZoomEnabled
								? "text-[var(--klb-color-accent-gold)]"
								: "text-[var(--klb-color-text-white)]"
						} hover:text-[var(--klb-color-accent-gold)]`}
					>
						<Icon name="pan-zoom" size={18} className="text-current" />
					</button>
					<button
						type="button"
						title={panZoomTooltip}
						className="p-1.5 rounded text-[var(--klb-color-text-white)] hover:text-[var(--klb-color-accent-gold)] transition-colors cursor-pointer"
					>
						<Icon name="pan-zoom" size={18} className="text-current rotate-90" />
					</button>
				</div>
			</div>
		</div>
	);
}
