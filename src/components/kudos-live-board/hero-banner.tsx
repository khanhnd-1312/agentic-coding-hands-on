"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface HeroBannerProps {
	dict: KudosLiveBoardDictionary;
	children?: ReactNode;
}

export function HeroBanner({ dict, children }: HeroBannerProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<section className="relative w-full h-[420px] md:h-[460px] lg:h-[512px] overflow-hidden">
			{/* Background image */}
			{!imageError && (
				<Image
					src="/images/kudos-live-board/hero-banner.png"
					alt=""
					fill
					priority
					className="object-cover object-right"
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
			<div className="relative z-10 flex flex-col items-start justify-end h-full px-4 xl:px-[var(--klb-spacing-page-x)] pb-6 lg:pb-10 gap-4">
				<h2 className="text-2xl lg:text-4xl font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight">
					{dict.hero.subtitle}
				</h2>
				{/* KUDOS wordmark SVG — fixed size, left-aligned */}
				<Image
					src="/images/homepage/kudos-wordmark.svg"
					alt="KUDOS"
					width={364}
					height={74}
					className="h-[50px] md:h-[60px] lg:h-[74px] w-auto"
				/>
				{/* Search bar — inside hero on the background */}
				{children && (
					<div className="flex items-center gap-4 mt-2 w-full">
						{children}
					</div>
				)}
			</div>
		</section>
	);
}
