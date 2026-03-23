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
			className="relative w-full h-[548px] border border-[var(--klb-color-border-gold)] rounded-2xl overflow-hidden"
			style={{
				background: "#00101a",
			}}
		>
			{/* Background image 1 — bottom-left corner */}
			<div
				className="absolute bottom-0 left-0 w-[55%] h-[80%] pointer-events-none"
				style={{
					backgroundImage: "url(/images/homepage/keyvisual.png)",
					backgroundSize: "cover",
					backgroundPosition: "bottom left",
					opacity: 0.35,
					maskImage:
						"radial-gradient(ellipse at bottom left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
					WebkitMaskImage:
						"radial-gradient(ellipse at bottom left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
				}}
			/>

			{/* Background image 2 — right side */}
			<div
				className="absolute top-0 right-0 w-[50%] h-full pointer-events-none"
				style={{
					backgroundImage: "url(/images/kudos-live-board/hero-banner.png)",
					backgroundSize: "cover",
					backgroundPosition: "center right",
					opacity: 0.3,
					maskImage:
						"radial-gradient(ellipse at right center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 65%)",
					WebkitMaskImage:
						"radial-gradient(ellipse at right center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 65%)",
				}}
			/>

			{/* Dark gradient overlay for readability */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(0,16,26,0.5) 0%, rgba(0,16,26,0.75) 100%)",
				}}
			/>

			{/* SVG mesh background pattern */}
			<div
				className="absolute inset-0 opacity-[0.07] pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 40 M 20 -10 L -10 20 M 50 30 L 30 50' stroke='%23998C5F' stroke-width='0.5' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23grid)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Top bar: Search (left) + "N KUDOS" (center) */}
			<div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
				{/* Search input — rounded with subtle border */}
				<div className="flex items-center gap-2.5 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 w-56">
					<Icon
						name="search"
						size={18}
						className="text-[var(--klb-color-text-muted)] shrink-0"
					/>
					<input
						type="text"
						placeholder={searchPlaceholder}
						maxLength={100}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-transparent text-[var(--klb-color-text-white)] placeholder:text-[var(--klb-color-text-muted)] text-sm outline-none w-full font-[family-name:var(--font-montserrat)]"
					/>
				</div>

				{/* "388 KUDOS" — centered */}
				<p className="absolute left-1/2 -translate-x-1/2 text-[32px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] whitespace-nowrap leading-tight">
					{totalKudos} KUDOS
				</p>

				{/* Spacer for right side */}
				<div className="w-56" />
			</div>

			{/* Word cloud area — scattered positioning */}
			<div className="relative z-10 flex-1" style={{ height: "calc(548px - 120px)" }}>
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

			{/* Bottom bar: Activity log (left) + Expand/Compress (right) */}
			<div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-6 pb-4">
				{/* Activity log — progressive opacity fade (earlier = more transparent) */}
				<div className="flex flex-col gap-0.5 max-w-[500px]">
					{activityLog.map((line, i) => (
						<p
							key={i}
							className="text-[10px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] truncate"
							style={{
								opacity: 0.2 + (i / (activityLog.length - 1 || 1)) * 0.6,
							}}
						>
							{line}
						</p>
					))}
				</div>

				{/* Expand / Compress icons — stacked vertically */}
				<div className="flex flex-col gap-1">
					<button
						type="button"
						onClick={() => setPanZoomEnabled((prev) => !prev)}
						aria-pressed={panZoomEnabled}
						title={panZoomTooltip}
						className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--klb-color-text-white)] hover:text-[var(--klb-color-accent-gold)]"
					>
						{/* Expand outward arrows */}
						<svg
							width={20}
							height={20}
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M21 3V8H19V5.41L14.41 10L13 8.59L17.59 4H15V2H20C20.55 2 21 2.45 21 3ZM3 3V8H5V5.41L9.59 10L11 8.59L6.41 4H9V2H4C3.45 2 3 2.45 3 3ZM3 21V16H5V18.59L9.59 14L11 15.41L6.41 20H9V22H4C3.45 22 3 21.55 3 21ZM21 21V16H19V18.59L14.41 14L13 15.41L17.59 20H15V22H20C20.55 22 21 21.55 21 21Z"
								fill="currentColor"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={() => setPanZoomEnabled((prev) => !prev)}
						title={panZoomTooltip}
						className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--klb-color-text-white)] hover:text-[var(--klb-color-accent-gold)]"
					>
						{/* Compress inward arrows */}
						<svg
							width={20}
							height={20}
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M15 3L17.3 5.3L14.41 8.17L15.83 9.59L18.7 6.7L21 9V3H15ZM3 9L5.3 6.7L8.17 9.59L9.59 8.17L6.7 5.3L9 3H3V9ZM9 21L6.7 18.7L9.59 15.83L8.17 14.41L5.3 17.3L3 15V21H9ZM21 15L18.7 17.3L15.83 14.41L14.41 15.83L17.3 18.7L15 21H21V15Z"
								fill="currentColor"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
