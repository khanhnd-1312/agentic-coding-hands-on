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

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label="Highlight Kudos"
			onKeyDown={handleKeyDown}
			tabIndex={0}
			className="flex flex-col items-center gap-6 outline-none"
		>
			{/* Carousel track with center-focus layout */}
			<div className="relative w-full flex items-center">
				{/* Left arrow */}
				<div className="absolute left-2 xl:left-8 z-10">
					<CarouselButton
						direction="prev"
						onClick={goPrev}
						disabled={currentSlide === 0}
					/>
				</div>

				{/* Cards container — center-focus */}
				<div className="w-full overflow-hidden px-12 xl:px-20">
					<div className="relative flex items-center justify-center min-h-[380px] lg:min-h-[420px]">
						{highlights.map((kudos, index) => {
							const offset = index - currentSlide;

							// Only render cards within visible range (-2 to +2)
							if (Math.abs(offset) > 2) return null;

							const isActive = offset === 0;
							const isAdjacent = Math.abs(offset) === 1;

							return (
								<div
									key={kudos.id}
									role="group"
									aria-roledescription="slide"
									aria-label={`Slide ${index + 1} of ${totalSlides}`}
									className="absolute transition-all duration-300 ease-in-out w-[280px] sm:w-[320px] lg:w-[380px]"
									style={{
										transform: `translateX(${offset * 105}%) scale(${isActive ? 1 : 0.9})`,
										opacity: isActive ? 1 : isAdjacent ? 0.5 : 0.3,
										zIndex: isActive ? 3 : isAdjacent ? 2 : 1,
										pointerEvents: isActive ? "auto" : "none",
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

				{/* Right arrow */}
				<div className="absolute right-2 xl:right-8 z-10">
					<CarouselButton
						direction="next"
						onClick={goNext}
						disabled={currentSlide === totalSlides - 1}
					/>
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
