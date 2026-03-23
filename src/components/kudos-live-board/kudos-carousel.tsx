"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

const SWIPE_THRESHOLD = 50; // px distance to trigger slide change

export function KudosCarousel({
	highlights,
	currentUserId,
	lang = "vi",
	onHashtagClick,
}: KudosCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = highlights.length;
	const trackRef = useRef<HTMLDivElement>(null);
	const [cardWidth, setCardWidth] = useState(528);

	// Swipe/drag state
	const dragStartX = useRef<number | null>(null);
	const isDragging = useRef(false);

	// Measure card width from the container on mount and resize
	useEffect(() => {
		function updateCardWidth() {
			if (!trackRef.current) return;
			const containerWidth = trackRef.current.offsetWidth;
			// Card widths: mobile 320, sm 420, lg 528
			if (containerWidth < 640) setCardWidth(320);
			else if (containerWidth < 1024) setCardWidth(420);
			else setCardWidth(528);
		}
		updateCardWidth();
		window.addEventListener("resize", updateCardWidth);
		return () => window.removeEventListener("resize", updateCardWidth);
	}, []);

	const goNext = useCallback(() => {
		setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
	}, [totalSlides]);

	const goPrev = useCallback(() => {
		setCurrentSlide((prev) => Math.max(prev - 1, 0));
	}, []);

	// Pointer drag handlers for swipe support
	const handlePointerDown = useCallback((e: React.PointerEvent) => {
		dragStartX.current = e.clientX;
		isDragging.current = false;
	}, []);

	const handlePointerMove = useCallback((e: React.PointerEvent) => {
		if (dragStartX.current === null) return;
		if (Math.abs(e.clientX - dragStartX.current) > 10) {
			isDragging.current = true;
		}
	}, []);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent) => {
			if (dragStartX.current === null) return;
			const diff = e.clientX - dragStartX.current;
			if (Math.abs(diff) >= SWIPE_THRESHOLD) {
				if (diff < 0) goNext();
				else goPrev();
			}
			dragStartX.current = null;
			isDragging.current = false;
		},
		[goNext, goPrev],
	);

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

	// The track holds all slides. We translate it so the current slide is centered.
	// Each slide takes cardWidth + 20px (10px padding on each side).
	const slideStep = cardWidth + 20;
	// Offset to center: half the container minus half a slide, then shift by currentSlide
	// We use a simpler approach: the track starts at 0, with the first card at index 0.
	// translateX = -(currentSlide * slideStep) positions currentSlide at the left edge of the viewport.
	// To center it, we add (containerWidth / 2 - slideStep / 2).
	// Since we don't know containerWidth in CSS easily, we use calc with 50%.
	const translateX = -(currentSlide * slideStep);

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
			<div
				ref={trackRef}
				className="relative w-full overflow-hidden touch-pan-y select-none"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
			>
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

				{/* Sliding track — all cards rendered, translated smoothly */}
				<div
					className="flex items-start transition-transform duration-300 ease-in-out"
					style={{
						transform: `translateX(calc(50% - ${slideStep / 2}px + ${translateX}px))`,
					}}
				>
					{highlights.map((kudos, idx) => {
						const offset = idx - currentSlide;
						const isActive = offset === 0;

						// Gradient mask for side cards
						let maskImage: string | undefined;
						if (offset < 0) {
							maskImage =
								"linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)";
						} else if (offset > 0) {
							maskImage =
								"linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)";
						}

						return (
							<div
								key={kudos.id}
								role="group"
								aria-roledescription="slide"
								aria-label={`Slide ${idx + 1} of ${totalSlides}`}
								className="shrink-0 w-[320px] sm:w-[420px] lg:w-[528px] px-[10px] transition-opacity duration-300 ease-in-out"
								style={{
									zIndex: isActive ? 3 : 1,
									pointerEvents: isActive ? "auto" : "none",
									opacity: Math.abs(offset) > 1 ? 0 : 1,
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
