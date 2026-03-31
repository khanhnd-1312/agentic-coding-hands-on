"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Tracks which section is currently active in the viewport using IntersectionObserver.
 *
 * - Uses rootMargin to offset the fixed header (80px).
 * - Uses a low threshold so tall sections are detected as soon as they enter the viewport.
 * - When multiple sections are visible, picks the topmost one (closest to viewport top).
 */
export function useScrollSpy(sectionIds: string[]): string {
	const [activeId, setActiveId] = useState(sectionIds[0]);
	const visibleIds = useRef(new Set<string>());

	useEffect(() => {
		const elements = sectionIds
			.map((id) => document.getElementById(id))
			.filter(Boolean) as HTMLElement[];

		if (elements.length === 0) return;

		visibleIds.current.clear();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleIds.current.add(entry.target.id);
					} else {
						visibleIds.current.delete(entry.target.id);
					}
				}

				// Pick the topmost visible section (in document order)
				const topmost = sectionIds.find((id) => visibleIds.current.has(id));
				if (topmost) {
					setActiveId(topmost);
				}
			},
			{
				// Offset for fixed header (80px) — shrink the effective viewport top
				rootMargin: "-80px 0px 0px 0px",
				threshold: [0, 0.1],
			}
		);

		for (const el of elements) {
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, [sectionIds]);

	return activeId;
}
