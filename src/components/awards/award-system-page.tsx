"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/homepage/header";
import { Footer } from "@/components/homepage/footer";
import { AwardInfoCard } from "./award-info-card";
import { AwardNavMenu } from "./award-nav-menu";
import { SunKudosBlock } from "./sun-kudos-block";
import { awardsDictionary } from "@/i18n/awards";
import type { AwardCategory } from "@/types/homepage";
import type { LanguagePreference } from "@/types/login";

interface AwardSystemPageProps {
	awards: AwardCategory[];
	initialLang?: LanguagePreference;
}

export function AwardSystemPage({ awards, initialLang = "vi" }: AwardSystemPageProps) {
	const [lang, setLang] = useState<LanguagePreference>(initialLang);
	const t = awardsDictionary[lang];

	return (
		<div className="bg-[#00101A] min-h-screen font-(family-name:--font-montserrat)">
			<Header lang={lang} onLangChange={setLang} />

			{/* Keyvisual Hero Banner */}
			<div className="relative w-full h-136.75 overflow-hidden">
				<Image
					src="/images/awards/kv-hero.png"
					alt="Keyvisual Sun* Annual Award 2025"
					fill
					sizes="100vw"
					style={{ objectFit: "cover" }}
					priority
				/>
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-[#00101A] to-transparent" />
			</div>

			<main className="relative z-10 -mt-40 lg:-mt-50">
				{/* Content area — gap:120px between major sections per design */}
				<div className="flex flex-col gap-16 px-4 pb-12 md:gap-20 md:px-8 md:pb-12 lg:gap-30 lg:px-36 lg:pb-24">
					{/* KV block: ROOT FURTHER artwork — 1152×150 container, image 338×150 left-aligned */}
					<div className="w-full h-37.5 flex flex-col items-start">
						<Image
							src="/images/awards/kv-root-further.png"
							alt=""
							width={1152}
							height={150}
							sizes="(max-width: 1024px) 100vw, 1152px"
							className="w-full h-auto object-contain object-left"
						/>
					</div>

					{/* Title section */}
					<div className="flex flex-col gap-4 w-full">
						<p className="text-2xl font-bold leading-8 text-white text-center">
							Sun* Annual Awards 2025
						</p>
						<hr className="border-[#2E3940] w-full" />
						<h1 className="text-[32px] md:text-[40px] lg:text-[57px] font-bold leading-10 md:leading-12 lg:leading-16 tracking-[-0.25px] text-[#FFEA9E] text-left">
							{t.pageTitle}
						</h1>
					</div>

					{/* Award system row: nav + cards */}
					<div className="flex flex-col lg:flex-row gap-10 lg:gap-20 w-full">
						{/* Left: nav menu */}
						<AwardNavMenu categories={awards} lang={lang} />

						{/* Right: award cards */}
						<div className="flex flex-col gap-10 lg:gap-20 flex-1">
							{awards.map((award, index) => (
								<AwardInfoCard key={award.id} award={award} lang={lang} reverse={index % 2 === 1} />
							))}
						</div>
					</div>
					{/* Sun* Kudos block */}
					<SunKudosBlock lang={lang} />
				</div>
			</main>

			<Footer lang={lang} />
		</div>
	);
}
