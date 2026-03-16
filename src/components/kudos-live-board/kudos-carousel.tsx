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
			{/* Carousel track */}
			<div className="w-full flex items-center gap-4">
				<CarouselButton
					direction="prev"
					onClick={goPrev}
					disabled={currentSlide === 0}
				/>

				<div className="flex-1 overflow-hidden">
					<div
						className="flex transition-transform duration-300 ease-in-out"
						style={{
							transform: `translateX(-${currentSlide * 100}%)`,
						}}
					>
						{highlights.map((kudos, index) => {
							const isActive = index === currentSlide;

							return (
								<div
									key={kudos.id}
									role="group"
									aria-roledescription="slide"
									aria-label={`Slide ${index + 1} of ${totalSlides}`}
									className="w-full shrink-0 px-2 transition-all duration-300"
									style={{
										opacity: isActive ? 1 : 0.5,
										transform: isActive ? "scale(1)" : "scale(0.9)",
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

				<CarouselButton
					direction="next"
					onClick={goNext}
					disabled={currentSlide === totalSlides - 1}
				/>
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
