import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface CTAButtonsProps {
	lang?: LanguagePreference;
}

export function CTAButtons({ lang = "vi" }: CTAButtonsProps) {
	const t = homepageDictionary[lang].cta;

	return (
		<div className="flex flex-row gap-[40px] flex-wrap max-sm:flex-col max-sm:gap-4">
			{/* Primary: ABOUT AWARDS */}
			<Link
				href="/awards"
				aria-label={t.aboutAwards}
				className={[
					"flex items-center justify-center gap-2",
					"w-[276px] h-[60px] py-4 px-6",
					"bg-[#FFEA9E] rounded-lg",
					"font-[var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]",
					"transition-[background-color,box-shadow] duration-150 ease-in-out",
					"hover:bg-[#FFE480] hover:shadow-[0_4px_12px_rgba(255,234,158,0.4)]",
					"active:bg-[#FFD740] active:scale-[0.98]",
					"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
					"max-sm:w-full",
				].join(" ")}
			>
				{t.aboutAwards}
				<Icon name="arrow-up" size={24} />
			</Link>

			{/* Secondary: ABOUT KUDOS */}
			<Link
				href="/kudo/live"
				aria-label={t.aboutKudos}
				className={[
					"flex items-center justify-center gap-2",
					"w-[254px] h-[60px] py-4 px-6",
					"bg-[rgba(255,234,158,0.10)] border border-[#998C5F] rounded-lg",
					"font-[var(--font-montserrat)] text-[22px] font-bold leading-7 text-white",
					"transition-[background-color,border-color,box-shadow,color] duration-150 ease-in-out",
					"hover:bg-[#FFEA9E] hover:text-[#00101A] hover:border-[#FFEA9E]",
					"active:bg-[#FFD740] active:scale-[0.98]",
					"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
					"max-sm:w-full",
				].join(" ")}
			>
				{t.aboutKudos}
				<Icon name="arrow-up" size={24} />
			</Link>
		</div>
	);
}
