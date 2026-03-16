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

/** Simple deterministic hash for stable jitter within grid cells */
function hashStr(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
	}
	return Math.abs(h);
}

/**
 * Grid-based scatter: divide the area into a grid and place one name
 * per cell with small random jitter. This avoids overlap while still
 * looking scattered like the Figma design.
 */
function gridScatterPositions(
	entries: SpotlightEntry[],
): { top: number; left: number }[] {
	const count = entries.length;
	if (count === 0) return [];

	// Calculate grid dimensions — aim for roughly square cells
	const cols = Math.ceil(Math.sqrt(count * 1.5));
	const rows = Math.ceil(count / cols);

	// Cell size in % — leave margin on edges
	const marginX = 3;
	const marginY = 5;
	const cellW = (100 - 2 * marginX) / cols;
	const cellH = (100 - 2 * marginY) / rows;

	return entries.map((entry, i) => {
		const row = Math.floor(i / cols);
		const col = i % cols;
		const h = hashStr(entry.user_id + i);

		// Jitter within cell (0–60% of cell size to avoid touching edges)
		const jitterX = ((h % 60) / 100) * cellW;
		const jitterY = (((h >>> 8) % 60) / 100) * cellH;

		return {
			top: marginY + row * cellH + jitterY,
			left: marginX + col * cellW + jitterX,
		};
	});
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

	const positions = useMemo(() => gridScatterPositions(entries), [entries]);

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

			{/* Word cloud area — scattered positioning */}
			<div className="relative z-10 min-h-[360px] lg:min-h-[440px]">
				{entries.map((entry, i) => {
					const ratio = entry.kudos_count / maxCount;
					const sizeClass = getSizeClass(ratio);
					const isMatch =
						normalizedSearch.length > 0 &&
						entry.name.toLowerCase().includes(normalizedSearch);
					const pos = positions[i];

					return (
						<span
							key={entry.user_id}
							className={`
								absolute whitespace-nowrap
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
							style={{
								top: `${pos.top}%`,
								left: `${pos.left}%`,
							}}
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
			</div>
		</div>
	);
}
