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
		<div className="w-full h-125 flex flex-col items-center justify-center">
			<div className="relative w-full h-125 rounded-2xl bg-[#0F0F0F] overflow-hidden flex flex-row">
				{/* Subtle gold gradient glow on left edge */}
				<div className="absolute inset-0 bg-linear-to-r from-[rgba(250,226,135,0.08)] via-transparent to-transparent pointer-events-none" />

				{/* Left content block */}
				<div className="relative z-10 w-117.5 h-102 flex flex-col justify-center gap-8 px-12 my-auto">
					<p className="text-2xl font-bold leading-8 text-white font-(family-name:--font-montserrat)">
						{t.caption}
					</p>

					<h2 className="text-[57px] font-bold leading-16 tracking-[-0.25px] text-[#FFEA9E] font-(family-name:--font-montserrat)">
						{t.title}
					</h2>

					<p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify font-(family-name:--font-montserrat)">
						{t.description}
					</p>

					<Link
						href="/kudo/live"
						aria-label={t.detailAriaLabel}
						className={[
							"inline-flex items-center gap-2",
							"w-31.75 h-14 px-4 rounded",
							"bg-[#FFEA9E] text-[#00101A]",
							"text-base font-bold leading-6 tracking-[0.15px]",
							"font-(family-name:--font-montserrat)",
							"transition-[background-color] duration-150 ease-in-out",
							"hover:bg-[#F5DF8A]",
							"focus:outline-2 focus:outline-[#FFEA9E] focus:outline-offset-2",
						].join(" ")}
					>
						{t.detail}
						<Icon name="ic-arrow" size={24} />
					</Link>
				</div>

				{/* Right decorative: Sun* logo + KUDOS text */}
				<div className="relative z-10 flex-1 flex items-center justify-center">
					<div className="flex items-center gap-3">
						<svg
							width="64"
							height="64"
							viewBox="0 0 64 64"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c6.2 0 11.9-2 16.6-5.5L32 32V4z"
								fill="#D4271D"
							/>
							<path
								d="M32 4c15.464 0 28 12.536 28 28 0 6.2-2 11.9-5.5 16.6L32 32V4z"
								fill="#D4271D"
								opacity="0.7"
							/>
						</svg>
						<span className="text-[72px] font-bold leading-none tracking-tight text-white/80 font-(family-name:--font-montserrat)">
							KUDOS
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
