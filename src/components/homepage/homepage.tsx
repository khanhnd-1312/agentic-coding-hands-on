"use client";

import { Suspense, useState } from "react";
import { Header } from "./header";
import { HeroSection } from "./hero-section";
import { AwardsSection } from "./awards-section";
import { SkeletonCards } from "./skeleton-cards";
import { KudosBlock } from "./kudos-block";
import { Footer } from "./footer";
import { WidgetButton } from "./widget-button";
import type { AwardCategory } from "@/types/homepage";
import type { LanguagePreference } from "@/types/login";

interface HomePageProps {
	awards?: AwardCategory[];
	initialLang?: LanguagePreference;
}

export function HomePage({ awards = [], initialLang = "vi" }: HomePageProps) {
	const [lang, setLang] = useState<LanguagePreference>(initialLang);

	return (
		<>
			{/* Skip navigation */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#FFEA9E] focus:text-[#00101A] focus:font-bold focus:rounded"
			>
				Skip to main content
			</a>

			<Header lang={lang} onLangChange={setLang} />

			<main id="main-content" className="pt-20">
				<HeroSection lang={lang} />

				<div
					className={[
						"flex flex-col items-center gap-[120px]",
						"px-[144px] py-[96px] max-md:px-10 max-sm:px-6",
					].join(" ")}
				>
					<Suspense fallback={<SkeletonCards />}>
						<AwardsSection awards={awards} lang={lang} />
					</Suspense>

					<KudosBlock lang={lang} />
				</div>
			</main>

			<Footer lang={lang} />

			<WidgetButton />
		</>
	);
}
