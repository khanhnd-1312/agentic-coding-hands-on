import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { Header } from "@/components/homepage/header";
import { Footer } from "@/components/homepage/footer";
import { KudosLiveBoardClient } from "@/components/kudos-live-board/kudos-live-board-client";
import type { LanguagePreference } from "@/types/login";
import type { Kudos, SpotlightResponse, UserStats, TopGiftSunner } from "@/types/kudos";

export const metadata = {
	title: "Sun* Kudos - Live Board | Sun Annual Awards 2025",
	description: "Browse, send, and interact with kudos on the Sun* Live Board",
};

async function fetchApi<T>(baseUrl: string, path: string): Promise<T | null> {
	try {
		const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
		if (!res.ok) return null;
		return (await res.json()) as T;
	} catch {
		return null;
	}
}

export default async function KudoLivePage() {
	const cookieStore = await cookies();
	const lang =
		(cookieStore.get("lang")?.value as LanguagePreference) ?? "vi";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// In production, require authentication
	if (!user && process.env.NODE_ENV !== "development") {
		redirect("/login");
	}

	const currentUserId = user?.id ?? "";
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

	// Fetch data via API routes (which handle auth and data transformation)
	const [highlightsJson, kudosJson, spotlightJson, statsJson, topGiftsJson] =
		await Promise.all([
			fetchApi<{ data: Kudos[] }>(baseUrl, "/api/kudos/highlights"),
			fetchApi<{ data: Kudos[]; has_more: boolean }>(baseUrl, "/api/kudos?page=1&limit=20"),
			fetchApi<SpotlightResponse>(baseUrl, "/api/spotlight"),
			fetchApi<UserStats>(baseUrl, "/api/users/me/stats"),
			fetchApi<{ items: TopGiftSunner[] }>(baseUrl, "/api/sunners/top-gifts"),
		]);

	const highlights = highlightsJson?.data ?? [];
	const kudos = kudosJson?.data ?? [];
	const hasMore = kudosJson?.has_more ?? false;
	const spotlight = spotlightJson ?? { total_kudos: 0, entries: [] };
	const stats: UserStats = statsJson ?? {
		kudos_received: 0,
		kudos_sent: 0,
		hearts_received: 0,
		secret_boxes_opened: 0,
		secret_boxes_unopened: 0,
	};
	const topGifts = topGiftsJson?.items ?? [];

	return (
		<main className="min-h-screen bg-[var(--klb-color-bg-primary)]">
			<Header lang={lang} activePage="kudo-live" />
			<KudosLiveBoardClient
				initialHighlights={highlights}
				initialKudos={kudos}
				initialHasMore={hasMore}
				currentUserId={currentUserId}
				initialStats={stats}
				initialTopGifts={topGifts}
				initialSpotlight={spotlight}
				lang={lang}
			/>
			<Footer lang={lang} />
		</main>
	);
}
