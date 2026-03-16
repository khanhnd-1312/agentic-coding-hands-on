"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface HeroBannerProps {
	dict: KudosLiveBoardDictionary;
}

export function HeroBanner({ dict }: HeroBannerProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<section className="relative w-full h-[360px] md:h-[400px] lg:h-[512px] overflow-hidden">
			{/* Background image */}
			{!imageError && (
				<Image
					src="/images/kudos-live-board/hero-banner.png"
					alt=""
					fill
					priority
					className="object-cover"
					onError={() => setImageError(true)}
				/>
			)}

			{/* Gradient overlay */}
			<div
				className="absolute inset-0"
				style={{
					background: imageError
						? "#00101A"
						: "linear-gradient(25deg, #00101A 14.74%, transparent 47.8%)",
				}}
			/>

			{/* Content — positioned lower inside the background */}
			<div className="relative z-10 flex flex-col justify-end h-full px-4 xl:px-[var(--klb-spacing-page-x)] pb-16 lg:pb-20">
				<h2 className="text-2xl lg:text-4xl font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight">
					{dict.hero.subtitle}
				</h2>
				<div className="flex items-center gap-2 mt-1">
					<Icon
						name="sun-flame"
						size={60}
						className="text-[var(--klb-color-accent-gold)] shrink-0 lg:w-[80px] lg:h-[80px]"
					/>
					<span
						className="text-[60px] md:text-[100px] lg:text-[139.78px] font-normal text-[var(--klb-color-accent-tan)] leading-none tracking-[-0.13em]"
						style={{ fontFamily: "var(--font-svn-gotham, 'SVN-Gotham', sans-serif)" }}
					>
						{dict.hero.logo}
					</span>
				</div>
			</div>
		</section>
	);
}
