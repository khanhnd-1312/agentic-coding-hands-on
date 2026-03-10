import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { AwardCategory } from "@/types/homepage";

interface AwardCardProps {
	award: AwardCategory;
	lang?: "vi" | "en";
}

export function AwardCard({ award, lang = "vi" }: AwardCardProps) {
	const detailLabel = lang === "en" ? "Details" : "Chi tiết";

	return (
		<div
			className={[
				"flex flex-col gap-6 w-[336px] max-w-full",
				"transition-transform duration-200 ease-out",
				"hover:-translate-y-1",
			].join(" ")}
		>
			{/* Picture area 336x336px
			    Design: MM_MEDIA_Award BG (shared background) + MM_MEDIA_[Name] (label overlay)
			    Award name PNGs are small text labels (30-64px tall) so we layer them on the bg */}
			<div
				className={[
					"relative w-[336px] h-[336px] max-w-full",
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
					<div className="relative w-[220px] h-[70px] mix-blend-screen">
						<Image
							src={award.thumbnailUrl}
							alt={award.name}
							fill
							className="object-contain object-center"
							sizes="220px"
						/>
					</div>
				</div>
			</div>

			{/* Frame 490: title + description + CTA button, gap 4px per Figma */}
			<div className="flex flex-col gap-1">
				<h3 className="text-[#FFEA9E] text-2xl font-normal leading-8">
					{award.name}
				</h3>
				<p className="text-white text-base font-normal leading-6 tracking-[0.5px] line-clamp-2">
					{award.description}
				</p>
				<Link
					href={`/awards-information#${award.slug}`}
					aria-label={`${detailLabel} — ${award.name}`}
					className={[
						"inline-flex items-center gap-2",
						"py-4 text-white text-base font-bold",
						"transition-[color] duration-150 ease-in-out",
						"hover:text-[#FFEA9E] hover:underline",
						"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
						"active:opacity-80",
					].join(" ")}
				>
					{detailLabel}
					<Icon name="arrow-up" size={16} />
				</Link>
			</div>
		</div>
	);
}
