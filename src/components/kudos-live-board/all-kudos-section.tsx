"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { KudoPostCard } from "./kudo-post-card";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useKudoLikeContext } from "@/contexts/kudo-like-context";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";
import type { Kudos, KudosListResponse } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface AllKudosSectionProps {
	initialKudos: Kudos[];
	initialHasMore: boolean;
	currentUserId: string;
	lang?: LanguagePreference;
	selectedHashtag?: string | null;
	selectedDepartment?: string | null;
	onHashtagClick?: (hashtagId: string) => void;
	sidebar?: ReactNode;
}

export function AllKudosSection({
	initialKudos,
	initialHasMore,
	currentUserId,
	lang = "vi",
	selectedHashtag,
	selectedDepartment,
	onHashtagClick,
	sidebar,
}: AllKudosSectionProps) {
	const t = kudosLiveBoardDictionary[lang].allKudos;

	const fetchPage = useCallback(
		async (page: number) => {
			const params = new URLSearchParams({ page: String(page), limit: "20" });
			if (selectedHashtag) params.set("hashtag", selectedHashtag);
			if (selectedDepartment) params.set("department", selectedDepartment);

			const res = await fetch(`/api/kudos?${params}`);
			if (!res.ok) throw new Error("Failed to fetch kudos");
			const json = (await res.json()) as KudosListResponse;
			return { data: json.data, has_more: json.has_more };
		},
		[selectedHashtag, selectedDepartment],
	);

	const { items, isLoading, hasMore, sentinelRef, reset } =
		useInfiniteScroll<Kudos>({
			fetchPage,
			initialData: initialKudos,
			initialHasMore,
		});

	const { registerKudos } = useKudoLikeContext();

	// Register newly loaded kudos into the like context (won't overwrite in-flight state)
	useEffect(() => {
		registerKudos(items);
	}, [items, registerKudos]);

	// Reset and re-fetch page 1 when filters change
	const isFirstMount = useRef(true);
	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
		async function refetch() {
			const params = new URLSearchParams({ page: "1", limit: "20" });
			if (selectedHashtag) params.set("hashtag", selectedHashtag);
			if (selectedDepartment) params.set("department", selectedDepartment);

			const res = await fetch(`/api/kudos?${params}`);
			if (res.ok) {
				const json = (await res.json()) as KudosListResponse;
				reset(json.data, json.has_more);
			}
		}
		refetch();
	}, [selectedHashtag, selectedDepartment, reset]);

	return (
		<section className="flex flex-col gap-10">
			{/* Section header */}
			<div className="px-4 xl:px-[var(--klb-spacing-page-x)]">
				<p className="text-2xl font-bold text-[var(--klb-color-text-white)] font-[family-name:var(--font-montserrat)]">
					{t.caption}
				</p>
				<h2 className="text-4xl lg:text-[57px] font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)] leading-tight mt-2">
					{t.title}
				</h2>
			</div>

			{/* Feed content */}
			<div className="px-4 xl:px-[var(--klb-spacing-page-x)] flex flex-col lg:flex-row gap-10 lg:gap-[var(--klb-spacing-sidebar-gap)]">
				{/* Kudos feed */}
				<div className="flex-1 flex flex-col gap-6">
					{items.length === 0 && !isLoading ? (
						<p className="text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)] text-center py-12">
							{t.empty}
						</p>
					) : (
						items.map((kudos) => (
							<div key={kudos.id} className="w-full max-w-[680px]">
								<KudoPostCard
									kudos={kudos}
									currentUserId={currentUserId}
									lang={lang}
									onHashtagClick={onHashtagClick}
								/>
							</div>
						))
					)}

					{/* Loading spinner */}
					{isLoading && (
						<div className="flex justify-center py-8">
							<div className="w-8 h-8 border-2 border-[var(--klb-color-accent-gold)] border-t-transparent rounded-full animate-spin" />
						</div>
					)}

					{/* Sentinel for infinite scroll */}
					{hasMore && <div ref={sentinelRef} className="h-4" />}
				</div>

				{/* Sidebar */}
				{sidebar ? (
					<div className="hidden lg:block w-[300px] shrink-0">
						{sidebar}
					</div>
				) : (
					<div className="hidden lg:block w-[300px] shrink-0" />
				)}
			</div>
		</section>
	);
}
