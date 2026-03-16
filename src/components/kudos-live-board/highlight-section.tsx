"use client";

import { KudosCarousel } from "./kudos-carousel";
import { FilterDropdown } from "./filter-dropdown";
import type { Kudos } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface FilterOption {
	id: string;
	name: string;
}

interface HighlightSectionProps {
	highlights: Kudos[];
	currentUserId: string;
	lang?: LanguagePreference;
	dict: KudosLiveBoardDictionary;
	hashtags?: FilterOption[];
	departments?: FilterOption[];
	selectedHashtag?: string | null;
	selectedDepartment?: string | null;
	onHashtagChange?: (id: string | null) => void;
	onDepartmentChange?: (id: string | null) => void;
	onHashtagClick?: (hashtagId: string) => void;
}

export function HighlightSection({
	highlights,
	currentUserId,
	lang = "vi",
	dict,
	hashtags = [],
	departments = [],
	selectedHashtag,
	selectedDepartment,
	onHashtagChange,
	onDepartmentChange,
	onHashtagClick,
}: HighlightSectionProps) {
	return (
		<section className="flex flex-col gap-10">
			{/* Section header with filters */}
			<div className="flex flex-col gap-4 px-4 xl:px-[var(--klb-spacing-page-x)]">
				<span className="text-2xl font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)]">
					{dict.highlight.caption}
				</span>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<h2 className="text-4xl lg:text-[57px] font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight lg:leading-[64px] tracking-[-0.25px]">
						{dict.highlight.title}
					</h2>
					<div className="flex items-center gap-3">
						<FilterDropdown
							label={dict.highlight.filterHashtag}
							options={hashtags}
							selected={selectedHashtag ?? null}
							onSelect={onHashtagChange ?? (() => {})}
						/>
						<FilterDropdown
							label={dict.highlight.filterDepartment}
							options={departments}
							selected={selectedDepartment ?? null}
							onSelect={onDepartmentChange ?? (() => {})}
						/>
					</div>
				</div>
			</div>

			{/* Carousel or empty state */}
			{highlights.length > 0 ? (
				<KudosCarousel
					highlights={highlights}
					currentUserId={currentUserId}
					lang={lang}
					onHashtagClick={onHashtagClick}
				/>
			) : (
				<p className="text-center text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)] text-base py-8">
					{dict.highlight.empty}
				</p>
			)}
		</section>
	);
}
