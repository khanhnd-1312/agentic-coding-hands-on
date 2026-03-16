import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface KudosBlockProps {
	lang?: LanguagePreference;
}

export function KudosBlock({ lang = "vi" }: KudosBlockProps) {
	const t = homepageDictionary[lang].kudos;

	return (
		<div
			className={[
				"relative flex flex-row items-center justify-between overflow-hidden",
				"w-full max-w-[1120px] h-[500px] max-md:h-auto max-md:flex-col max-md:gap-10",
				"bg-[#0F0F0F] rounded-2xl",
				"px-[80px] py-[60px] max-md:px-10 max-sm:px-6 max-sm:py-10",
			].join(" ")}
		>
			{/* Background decorative image */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<Image
					src="/images/homepage/kudos-bg.png"
					alt=""
					fill
					className="object-cover object-center opacity-30"
					aria-hidden="true"
				/>
			</div>

			{/* D2 Content block */}
			<div className="relative z-[1] flex flex-col gap-8 max-w-[457px]">
				<span className="text-white text-2xl font-bold leading-8">{t.caption}</span>
				<h2 className="text-[#FFEA9E] text-[57px] font-bold leading-[64px] tracking-[-0.25px]">
					{t.title}
				</h2>
				<p className="text-white text-base font-bold leading-6 tracking-[0.5px] text-justify whitespace-pre-line">
					{t.description}
				</p>
				<Link
					href="/kudo/live"
					aria-label={t.detail}
					className={[
						"inline-flex items-center gap-2",
						"w-[127px] h-[56px] px-4 rounded",
						"bg-[#FFEA9E] text-[#00101A]",
						"text-base font-bold leading-6 tracking-[0.15px]",
						"font-(family-name:--font-montserrat)",
						"transition-[background-color] duration-150 ease-in-out",
						"hover:bg-[#F5DF8A]",
						"focus:outline-2 focus:outline-[#FFEA9E] focus:outline-offset-2",
					].join(" ")}
				>
					{t.detail}
					<Icon name="arrow-up" size={24} />
				</Link>
			</div>

			{/* Decorative: KUDOS wordmark */}
			<div className="relative z-[1] flex items-center justify-center w-[264px] h-[219px] max-md:w-full max-md:h-auto">
				<Image
					src="/images/homepage/kudos-wordmark.svg"
					alt="KUDOS"
					width={264}
					height={219}
					className="w-full h-auto"
				/>
			</div>
		</div>
	);
}
