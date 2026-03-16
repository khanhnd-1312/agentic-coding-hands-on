import { SpotlightBoard } from "./spotlight-board";
import type { SpotlightResponse } from "@/types/kudos";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface SpotlightSectionProps {
	data: SpotlightResponse | null;
	dict: KudosLiveBoardDictionary;
	isLoading: boolean;
}

export function SpotlightSection({
	data,
	dict,
	isLoading,
}: SpotlightSectionProps) {
	const t = dict.spotlight;

	return (
		<section className="flex flex-col gap-10">
			{/* Section header */}
			<div className="px-4 xl:px-[var(--klb-spacing-page-x)]">
				<p className="text-sm font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)] tracking-wider uppercase">
					{t.caption}
				</p>
				<h2 className="text-4xl lg:text-[57px] font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight mt-2">
					{t.title}
				</h2>
			</div>

			{/* Content */}
			<div className="px-4 xl:px-[var(--klb-spacing-page-x)]">
				{isLoading ? (
					<div
						role="status"
						className="flex justify-center py-12"
					>
						<div className="w-8 h-8 border-2 border-[var(--klb-color-accent-gold)] border-t-transparent rounded-full animate-spin" />
					</div>
				) : !data || data.entries.length === 0 ? (
					<p className="text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)] text-center py-12">
						{t.empty}
					</p>
				) : (
					<div className="flex flex-col gap-6">
						{/* Total kudos header */}
						<p className="text-[32px] font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)]">
							{data.total_kudos} KUDOS
						</p>

						{/* Board */}
						<SpotlightBoard
							entries={data.entries}
							searchPlaceholder={t.searchPlaceholder}
							panZoomTooltip={t.panZoomTooltip}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
