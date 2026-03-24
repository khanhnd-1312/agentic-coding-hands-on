"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { HeroBanner } from "./hero-banner";

const WriteKudoModal = dynamic(
	() => import("@/components/write-kudo/write-kudo-modal").then((m) => ({ default: m.WriteKudoModal })),
	{ ssr: false },
);
import { KudosSearchInput } from "./kudos-search-input";
import { ProfileSearchButton } from "./profile-search-button";
import { HighlightSection } from "./highlight-section";
import { SpotlightSection } from "./spotlight-section";
import { AllKudosSection } from "./all-kudos-section";
import { KudosSidebar } from "./kudos-sidebar";
import { KudoLikeProvider } from "@/contexts/kudo-like-context";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";
import type {
	Kudos,
	UserStats,
	TopGiftSunner,
	SpotlightResponse,
} from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface FilterOption {
	id: string;
	name: string;
}

interface KudosLiveBoardClientProps {
	initialHighlights: Kudos[];
	initialKudos: Kudos[];
	initialHasMore: boolean;
	currentUserId: string;
	initialStats: UserStats;
	initialTopGifts: TopGiftSunner[];
	initialSpotlight: SpotlightResponse | null;
	lang?: LanguagePreference;
}

export function KudosLiveBoardClient({
	initialHighlights,
	initialKudos,
	initialHasMore,
	currentUserId,
	initialStats,
	initialTopGifts,
	initialSpotlight,
	lang = "vi",
}: KudosLiveBoardClientProps) {
	const dict = kudosLiveBoardDictionary[lang];

	const [isWriteKudoOpen, setIsWriteKudoOpen] = useState(false);
	const [hashtags, setHashtags] = useState<FilterOption[]>([]);
	const [departments, setDepartments] = useState<FilterOption[]>([]);
	const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
		null,
	);
	const [highlights, setHighlights] = useState<Kudos[]>(initialHighlights);
	const [spotlight, setSpotlight] = useState<SpotlightResponse | null>(
		initialSpotlight,
	);
	const [spotlightLoading, setSpotlightLoading] = useState(!initialSpotlight);

	// Fetch filter options on mount
	useEffect(() => {
		async function fetchFilterOptions() {
			const [hashtagsRes, departmentsRes] = await Promise.all([
				fetch("/api/hashtags"),
				fetch("/api/departments"),
			]);
			if (hashtagsRes.ok) {
				const json = (await hashtagsRes.json()) as { data: FilterOption[] };
				setHashtags(json.data);
			}
			if (departmentsRes.ok) {
				const json = (await departmentsRes.json()) as { data: FilterOption[] };
				setDepartments(json.data);
			}
		}
		fetchFilterOptions();
	}, []);

	// Fetch spotlight data if not provided via SSR
	useEffect(() => {
		if (initialSpotlight) return;
		async function fetchSpotlight() {
			const res = await fetch("/api/spotlight");
			if (res.ok) {
				const json = (await res.json()) as SpotlightResponse;
				setSpotlight(json);
			}
			setSpotlightLoading(false);
		}
		fetchSpotlight();
	}, [initialSpotlight]);

	// Re-fetch highlights when filters change
	useEffect(() => {
		async function fetchHighlights() {
			const params = new URLSearchParams();
			if (selectedHashtag) params.set("hashtag", selectedHashtag);
			if (selectedDepartment) params.set("department", selectedDepartment);

			const res = await fetch(`/api/kudos/highlights?${params}`);
			if (res.ok) {
				const json = (await res.json()) as { data: Kudos[] };
				setHighlights(json.data);
			}
		}
		if (selectedHashtag !== null || selectedDepartment !== null) {
			fetchHighlights();
		} else {
			setHighlights(initialHighlights);
		}
	}, [selectedHashtag, selectedDepartment, initialHighlights]);

	const handleHashtagClick = useCallback((hashtagId: string) => {
		setSelectedHashtag((prev) => (prev === hashtagId ? null : hashtagId));
	}, []);

	const allInitialKudos = [...initialHighlights, ...initialKudos];

	return (
		<KudoLikeProvider initialKudos={allInitialKudos}>
		<>
		<div className="flex flex-col">
			{/* Hero Banner — search bar rendered inside on the background */}
			<HeroBanner dict={dict}>
				<KudosSearchInput
					placeholder={dict.hero.searchPlaceholder}
					onClick={() => setIsWriteKudoOpen(true)}
				/>
				<ProfileSearchButton label={dict.hero.profileSearch} />
			</HeroBanner>

			{/* Main content sections */}
			<div className="flex flex-col gap-[var(--klb-spacing-section-gap)] mt-16 pb-[var(--klb-spacing-section-gap)]">
				<HighlightSection
					highlights={highlights}
					currentUserId={currentUserId}
					lang={lang}
					dict={dict}
					hashtags={hashtags}
					departments={departments}
					selectedHashtag={selectedHashtag}
					selectedDepartment={selectedDepartment}
					onHashtagChange={setSelectedHashtag}
					onDepartmentChange={setSelectedDepartment}
					onHashtagClick={handleHashtagClick}
				/>

				<SpotlightSection
					data={spotlight}
					dict={dict}
					isLoading={spotlightLoading}
				/>

				<AllKudosSection
					initialKudos={initialKudos}
					initialHasMore={initialHasMore}
					currentUserId={currentUserId}
					lang={lang}
					selectedHashtag={selectedHashtag}
					selectedDepartment={selectedDepartment}
					onHashtagClick={handleHashtagClick}
					sidebar={
						<KudosSidebar
							stats={initialStats}
							topGifts={initialTopGifts}
							dict={dict}
							onOpenSecretBox={() => {
								// TODO: open secret box dialog
							}}
						/>
					}
				/>
			</div>
		</div>

			{/* Write Kudo Modal — lazy loaded */}
			{isWriteKudoOpen && (
				<WriteKudoModal
					isOpen={isWriteKudoOpen}
					onClose={() => setIsWriteKudoOpen(false)}
					onSuccess={() => {
						window.location.reload();
					}}
				/>
			)}
		</>
		</KudoLikeProvider>
	);
}
