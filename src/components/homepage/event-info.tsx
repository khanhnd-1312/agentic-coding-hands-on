import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface EventInfoProps {
	lang?: LanguagePreference;
}

export function EventInfo({ lang = "vi" }: EventInfoProps) {
	const t = homepageDictionary[lang].event;

	return (
		<div className="flex flex-col gap-2 w-[637px] max-w-full">
			{/* Row 1: Time */}
			<div className="flex flex-row items-baseline gap-[60px]">
				<div className="flex flex-row items-baseline gap-2">
					<span className="text-white text-base font-bold leading-6 tracking-[0.15px]">
						{t.timeLabel}
					</span>
					<span className="text-[#FFEA9E] text-2xl font-bold leading-8">
						{t.timeValue}
					</span>
				</div>
				<div className="flex flex-row items-baseline gap-2">
					<span className="text-white text-base font-bold leading-6 tracking-[0.15px]">
						{t.venueLabel}
					</span>
					<span className="text-[#FFEA9E] text-2xl font-bold leading-8">
						{t.venueValue}
					</span>
				</div>
			</div>

			{/* Facebook group note — static <p>, not a link */}
			<p
				data-testid="facebook-note"
				className="text-white text-base font-bold leading-6 tracking-[0.15px]"
			>
				{t.facebookNote}
			</p>
		</div>
	);
}
