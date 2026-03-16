"use client";

import { useState } from "react";
import Image from "next/image";
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

			{/* Content */}
			<div className="relative z-10 flex flex-col justify-end h-full px-4 xl:px-[var(--klb-spacing-page-x)] pb-12 lg:pb-16">
				<h2 className="text-2xl lg:text-4xl font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight">
					{dict.hero.subtitle}
				</h2>
				<span
					className="text-[60px] md:text-[100px] lg:text-[139.78px] font-normal text-[var(--klb-color-accent-tan)] leading-none tracking-[-13%]"
					style={{ fontFamily: "var(--font-svn-gotham, 'SVN-Gotham', sans-serif)" }}
				>
					{dict.hero.logo}
				</span>
			</div>
		</section>
	);
}
