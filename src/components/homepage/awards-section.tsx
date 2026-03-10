import { AwardCard } from "./award-card";
import { SkeletonCards } from "./skeleton-cards";
import type { AwardCategory } from "@/types/homepage";
import type { LanguagePreference } from "@/types/login";
import { homepageDictionary } from "@/i18n/homepage";

interface AwardsSectionProps {
	awards: AwardCategory[];
	lang?: LanguagePreference;
	loading?: boolean;
	error?: boolean;
	onRetry?: () => void;
}

export function AwardsSection({
	awards,
	lang = "vi",
	loading = false,
	error = false,
	onRetry,
}: AwardsSectionProps) {
	const t = homepageDictionary[lang].awards;

	return (
		<section
			aria-label={t.title}
			className="w-full"
		>
			{/* C1 Section header */}
			<div className="flex flex-col gap-4 mb-[80px]">
				<span className="text-white text-2xl font-bold leading-8">
					{t.caption}
				</span>
				<hr className="border-[#2E3940]" />
				<h2 className="text-[#FFEA9E] text-[57px] font-bold leading-[64px] tracking-[-0.25px]">
					{t.title}
				</h2>
			</div>

			{/* Error state */}
			{error && (
				<div
					role="alert"
					className="flex flex-col items-center gap-4 py-12 text-center"
				>
					<p className="text-red-400 text-base font-bold">{t.errorState}</p>
					<button
						type="button"
						onClick={onRetry}
						className="px-6 py-3 bg-[#FFEA9E] text-[#00101A] font-bold rounded-lg hover:bg-[#FFE480] focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2"
					>
						{t.retry}
					</button>
				</div>
			)}

			{/* Loading state */}
			{!error && loading && <SkeletonCards />}

			{/* Empty state */}
			{!error && !loading && awards.length === 0 && (
				<p className="text-white text-base font-bold py-12 text-center">
					{t.emptyState}
				</p>
			)}

			{/* C2 Award grid */}
			{!error && !loading && awards.length > 0 && (
				<div className="flex flex-wrap gap-[80px] max-md:gap-10 max-sm:gap-6 justify-start">
					{awards.map((award) => (
						<AwardCard key={award.id} award={award} lang={lang} />
					))}
				</div>
			)}
		</section>
	);
}
