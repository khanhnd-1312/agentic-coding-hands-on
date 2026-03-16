"use client";

import { useState, useCallback } from "react";
import { HighlightKudoCard } from "./highlight-kudo-card";
import { CarouselButton } from "./carousel-button";
import { PaginationIndicator } from "./pagination-indicator";
import type { Kudos } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface KudosCarouselProps {
	highlights: Kudos[];
	currentUserId: string;
	lang?: LanguagePreference;
	onHashtagClick?: (hashtagId: string) => void;
}

export function KudosCarousel({
	highlights,
	currentUserId,
	lang = "vi",
	onHashtagClick,
}: KudosCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = highlights.length;

	const goNext = useCallback(() => {
		setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
	}, [totalSlides]);

	const goPrev = useCallback(() => {
		setCurrentSlide((prev) => Math.max(prev - 1, 0));
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowRight") {
				goNext();
			} else if (e.key === "ArrowLeft") {
				goPrev();
			}
		},
		[goNext, goPrev],
	);

	if (totalSlides === 0) return null;

	// Render exactly 3 slots: prev, current, next — centered via flex justify-center.
	// Edge slots use invisible spacers when at first/last slide.
	const visibleIndices = [currentSlide - 1, currentSlide, currentSlide + 1];

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label="Highlight Kudos"
			onKeyDown={handleKeyDown}
			tabIndex={0}
			className="flex flex-col items-center gap-6 outline-none"
		>
			{/* Carousel track */}
			<div className="relative w-full overflow-hidden">
				{/* Navigation arrows */}
				<div className="absolute left-2 xl:left-8 top-1/2 -translate-y-1/2 z-20">
					<CarouselButton
						direction="prev"
						onClick={goPrev}
						disabled={currentSlide === 0}
					/>
				</div>
				<div className="absolute right-2 xl:right-8 top-1/2 -translate-y-1/2 z-20">
					<CarouselButton
						direction="next"
						onClick={goNext}
						disabled={currentSlide === totalSlides - 1}
					/>
				</div>

				{/* Visible cards — exactly 3 slots, centered */}
				<div className="flex justify-center items-start">
					{visibleIndices.map((idx) => {
						if (idx < 0 || idx >= totalSlides) {
							// Invisible spacer to keep center card centered at edges
							return (
								<div
									key={`spacer-${idx}`}
									className="shrink-0 w-[320px] sm:w-[420px] lg:w-[528px] px-[10px]"
								/>
							);
						}

						const kudos = highlights[idx];
						const offset = idx - currentSlide;
						const isActive = offset === 0;

						// Gradient mask for side cards
						let maskImage: string | undefined;
						if (offset === -1) {
							maskImage =
								"linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)";
						} else if (offset === 1) {
							maskImage =
								"linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)";
						}

						return (
							<div
								key={kudos.id}
								role="group"
								aria-roledescription="slide"
								aria-label={`Slide ${idx + 1} of ${totalSlides}`}
								className="shrink-0 w-[320px] sm:w-[420px] lg:w-[528px] px-[10px]"
								style={{
									zIndex: isActive ? 3 : 1,
									pointerEvents: isActive ? "auto" : "none",
									WebkitMaskImage: maskImage,
									maskImage: maskImage,
								}}
							>
								<HighlightKudoCard
									kudos={kudos}
									currentUserId={currentUserId}
									lang={lang}
									onHashtagClick={onHashtagClick}
								/>
							</div>
						);
					})}
				</div>
			</div>

			{/* Pagination */}
			<div className="flex items-center gap-4">
				<CarouselButton
					direction="prev"
					onClick={goPrev}
					disabled={currentSlide === 0}
				/>
				<PaginationIndicator
					current={currentSlide + 1}
					total={totalSlides}
				/>
				<CarouselButton
					direction="next"
					onClick={goNext}
					disabled={currentSlide === totalSlides - 1}
				/>
			</div>
		</div>
	);
}
