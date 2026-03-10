import Image from "next/image";
import { Countdown } from "./countdown";
import { EventInfo } from "./event-info";
import { CTAButtons } from "./cta-buttons";
import { ContentBlock } from "./content-block";
import type { LanguagePreference } from "@/types/login";

interface HeroSectionProps {
	lang?: LanguagePreference;
}

export function HeroSection({ lang = "vi" }: HeroSectionProps) {
	return (
		<section className="relative w-full">
			{/* Keyvisual — full-bleed background image */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				<Image
					src="/images/homepage/keyvisual.png"
					alt="SAA 2025 keyvisual"
					fill
					className="object-cover object-center"
					priority
					sizes="100vw"
				/>
			</div>

			{/* Gradient cover: linear-gradient(12deg, #00101A, transparent) */}
			<div
				data-testid="gradient-cover"
				className="absolute inset-0 z-[1]"
				style={{
					background:
						"linear-gradient(12deg, #00101A 0%, rgba(0,16,26,0.85) 40%, transparent 100%)",
				}}
			/>

			{/* Bìa: flex column, padding 96px 144px, gap 120px between Frame487 and B3 */}
			<div className="relative z-[2] flex flex-col px-[144px] pt-[96px] pb-[96px] gap-[120px] max-md:px-12 max-md:pt-16 max-sm:px-4 max-sm:pt-24">
				{/* Frame 487: Root Further logo + Frame 523 (B1+B2), gap 40px per Figma */}
				<div className="flex flex-col gap-[40px]">
					{/* Root Further logo */}
					<Image
						src="/images/homepage/root-further-logo.png"
						alt="Root Further — Sun Annual Awards 2025"
						width={451}
						height={200}
						priority
						className="w-[451px] max-w-full h-auto"
					/>

					{/* Frame 523: B1 + B2 grouped with 16px gap */}
					<div className="flex flex-col gap-4">
						{/* B1: Countdown */}
						<Countdown lang={lang} />

						{/* B2: Event info */}
						<EventInfo lang={lang} />
					</div>
				</div>

				{/* B3: CTA buttons — sibling of Frame 487, 120px gap */}
				<CTAButtons lang={lang} />
			</div>

			{/* B4: ROOT FURTHER image + body text
			    Frame 486: gap 32px, padding 120px top/bottom 104px left/right, alignItems center */}
			<div className="relative z-[2] flex flex-col items-center gap-8 px-[104px] py-[120px] max-md:px-12 max-sm:px-6">
				<Image
					src="/images/homepage/root-further-logo.png"
					alt=""
					width={290}
					height={134}
					className="w-[290px] max-w-full h-auto"
					aria-hidden="true"
				/>
				<ContentBlock lang={lang} />
			</div>
		</section>
	);
}
