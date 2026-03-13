"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[]): string {
	const [activeId, setActiveId] = useState(sectionIds[0]);

	useEffect(() => {
		const elements = sectionIds
			.map((id) => document.getElementById(id))
			.filter(Boolean) as Element[];

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ threshold: 0.5 }
		);

		for (const el of elements) {
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, [sectionIds]);

	return activeId;
}
