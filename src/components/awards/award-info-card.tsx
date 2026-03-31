import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { awardsDictionary, translateAward } from "@/i18n/awards";
import type { AwardCategory } from "@/types/homepage";
import type { LanguagePreference } from "@/types/login";

interface AwardInfoCardProps {
	award: AwardCategory;
	lang?: LanguagePreference;
	reverse?: boolean;
}

export function AwardInfoCard({ award: rawAward, lang = "vi", reverse = false }: AwardInfoCardProps) {
	const t = awardsDictionary[lang];
	const award = translateAward(rawAward, lang);
	const formattedQuantity =
		award.quantity !== undefined
			? String(award.quantity).padStart(2, "0")
			: "";

	return (
		<section id={award.slug} aria-labelledby={`${award.slug}-title`}>
			{/* Inner row: image + content — alternating layout */}
			<div
				className={[
					"flex flex-col lg:flex-row gap-6 lg:gap-10 w-full",
					reverse ? "lg:flex-row-reverse" : "",
				].join(" ")}
			>
				{/* Award image — layered: shared medal background + award name label overlay (matching Homepage C2 design) */}
				<div
					className={[
						"relative w-84 h-84 max-w-full shrink-0",
						"border-[0.955px] border-[#FFEA9E] rounded-3xl overflow-hidden",
						"shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]",
					].join(" ")}
				>
					{/* Shared 336x336 medal background */}
					<Image
						src="/images/homepage/award-bg.png"
						alt=""
						fill
						className="object-cover object-center"
						sizes="336px"
						aria-hidden="true"
					/>

					{/* Award name label centered over the medal */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="relative w-55 h-17.5 mix-blend-screen">
							<Image
								src={award.thumbnailUrl}
								alt={`${t.awardImageAlt} ${award.name}`}
								fill
								className="object-contain object-center"
								sizes="220px"
							/>
						</div>
					</div>
				</div>

				{/* Content block */}
				<div className="w-full lg:w-120 flex flex-col gap-8 rounded-2xl backdrop-blur-[32px]">
					{/* Title with target icon */}
					<div className="flex flex-row items-center gap-2">
						<Icon
							name="target"
							size={24}
							className="[&_path]:fill-[#FFEA9E]"
						/>
						<h2
							id={`${award.slug}-title`}
							className="text-2xl font-bold leading-8 text-[#FFEA9E] font-(family-name:--font-montserrat)"
						>
							{award.name}
						</h2>
					</div>

					<p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify font-(family-name:--font-montserrat) whitespace-pre-line">
						{award.description}
					</p>

					{/* Divider */}
					<hr className="border-[#2E3940] w-full" />

					{/* Quantity metadata row */}
					{award.quantity !== undefined && (
						<div className="flex flex-row items-center gap-4 h-11">
							<Icon
								name="diamond"
								size={24}
								className="[&_path]:fill-[#FFEA9E]"
							/>
							<span className="text-2xl font-bold leading-8 text-[#FFEA9E] font-(family-name:--font-montserrat)">
								{t.quantityLabel}
							</span>
							<span className="text-4xl font-bold leading-11 text-white font-(family-name:--font-montserrat)">
								{formattedQuantity}
							</span>
							{award.unit && (
								<span className="text-sm font-bold leading-5 tracking-[0.1px] text-white font-(family-name:--font-montserrat)">
									{award.unit}
								</span>
							)}
						</div>
					)}

					{/* Divider */}
					<hr className="border-[#2E3940] w-full" />

					{/* Prize value section — column layout per Figma */}
					{award.prize && (
						<div className="flex flex-col gap-2">
							<div className="flex flex-row items-center gap-4">
								<Icon
									name="license"
									size={24}
									className="[&_path]:fill-[#FFEA9E]"
								/>
								<span className="text-2xl font-bold leading-8 text-[#FFEA9E] font-(family-name:--font-montserrat)">
									{t.prizeLabel}
								</span>
							</div>
							<span className="text-4xl font-bold leading-11 text-white font-(family-name:--font-montserrat)">
								{award.prize}
							</span>
							{award.prizeLabel && (
								<span className="text-sm font-bold leading-5 tracking-[0.1px] text-white font-(family-name:--font-montserrat)">
									{award.prizeLabel}
								</span>
							)}
						</div>
					)}

					{/* "Or" separator + second prize (Signature 2025) */}
					{award.secondPrize && (
						<>
							<div className="flex flex-row items-center gap-4">
								<span className="text-sm font-bold leading-5 text-[#FFEA9E] font-(family-name:--font-montserrat)">
									{t.orSeparator}
								</span>
								<hr className="border-[#2E3940] flex-1" />
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex flex-row items-center gap-4">
									<Icon
										name="license"
										size={24}
										className="[&_path]:fill-[#FFEA9E]"
									/>
									<span className="text-2xl font-bold leading-8 text-[#FFEA9E] font-(family-name:--font-montserrat)">
										{t.prizeLabel}
									</span>
								</div>
								<span className="text-4xl font-bold leading-11 text-white font-(family-name:--font-montserrat)">
									{award.secondPrize}
								</span>
								{award.secondPrizeLabel && (
									<span className="text-sm font-bold leading-5 tracking-[0.1px] text-white font-(family-name:--font-montserrat)">
										{award.secondPrizeLabel}
									</span>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			{/* Bottom divider */}
			<hr className="border-[#2E3940] w-full mt-20" />
		</section>
	);
}
