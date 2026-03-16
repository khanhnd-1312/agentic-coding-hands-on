import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { awardsDictionary } from "@/i18n/awards";
import type { LanguagePreference } from "@/types/login";

interface SunKudosBlockProps {
	lang?: LanguagePreference;
}

export function SunKudosBlock({ lang = "vi" }: SunKudosBlockProps) {
	const t = awardsDictionary[lang].kudos;
	return (
		<div
			className={[
				"relative flex flex-row items-center justify-between overflow-hidden",
				"w-full h-125 max-md:h-auto max-md:flex-col max-md:gap-10",
				"bg-[#0F0F0F] rounded-2xl",
				"px-20 py-15 max-md:px-10 max-sm:px-6 max-sm:py-10",
			].join(" ")}
		>
			{/* Background decorative image */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<Image
					src="/images/homepage/kudos-bg.png"
					alt=""
					fill
					className="object-cover object-center"
					aria-hidden="true"
				/>
			</div>

			{/* Left content block */}
			<div className="relative z-[1] flex flex-col gap-8 max-w-[457px]">
				<span className="text-white text-2xl font-bold leading-8 font-(family-name:--font-montserrat)">
					{t.caption}
				</span>

				<h2 className="text-[#FFEA9E] text-[57px] font-bold leading-16 tracking-[-0.25px] font-(family-name:--font-montserrat)">
					{t.title}
				</h2>

				<p className="text-white text-base font-bold leading-6 tracking-[0.5px] text-justify font-(family-name:--font-montserrat) whitespace-pre-line">
					{t.description}
				</p>

				<Link
					href="/kudo/live"
					aria-label={t.detailAriaLabel}
					className={[
						"inline-flex items-center gap-2",
						"w-[127px] h-14 px-4 rounded",
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
