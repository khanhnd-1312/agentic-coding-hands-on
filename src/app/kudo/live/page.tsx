import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { Header } from "@/components/homepage/header";
import { Footer } from "@/components/homepage/footer";
import { KudosLiveBoardClient } from "@/components/kudos-live-board/kudos-live-board-client";
import type { LanguagePreference } from "@/types/login";

export const metadata = {
	title: "Sun* Kudos - Live Board | Sun Annual Awards 2025",
	description: "Browse, send, and interact with kudos on the Sun* Live Board",
};

export default async function KudoLivePage() {
	const cookieStore = await cookies();
	const lang =
		(cookieStore.get("lang")?.value as LanguagePreference) ?? "vi";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Fetch initial data in parallel
	const [highlightsRes, kudosRes, spotlightRes, statsRes, topGiftsRes] =
		await Promise.all([
			supabase
				.from("kudos")
				.select(
					"id, sender_id, receiver_id, content, images, heart_count, created_at, sender:profiles!kudos_sender_id_fkey(id, name, avatar_url, department_name, kudos_received_count), receiver:profiles!kudos_receiver_id_fkey(id, name, avatar_url, department_name, kudos_received_count), hashtags(id, name), is_liked_by_me:hearts!left(id)",
				)
				.order("heart_count", { ascending: false })
				.limit(10),
			supabase
				.from("kudos")
				.select(
					"id, sender_id, receiver_id, content, images, heart_count, created_at, sender:profiles!kudos_sender_id_fkey(id, name, avatar_url, department_name, kudos_received_count), receiver:profiles!kudos_receiver_id_fkey(id, name, avatar_url, department_name, kudos_received_count), hashtags(id, name), is_liked_by_me:hearts!left(id)",
				)
				.order("created_at", { ascending: false })
				.range(0, 19),
			supabase
				.from("kudos_receiver_counts")
				.select(
					"receiver_id, count, receiver:profiles!kudos_receiver_counts_receiver_id_fkey(id, name)",
				)
				.order("count", { ascending: false }),
			supabase.rpc("get_user_stats", { p_user_id: user.id }),
			supabase
				.from("secret_boxes")
				.select(
					"id, reward_content, opened_at, user:profiles!secret_boxes_user_id_fkey(id, name, avatar_url)",
				)
				.eq("is_opened", true)
				.order("opened_at", { ascending: false })
				.limit(10),
		]);

	// Transform highlights
	const highlights = (highlightsRes.data ?? []).map((k) => ({
		...k,
		sender: k.sender as unknown as {
			id: string;
			name: string;
			avatar_url: string | null;
			department_name: string | null;
			kudos_received_count: number;
		},
		receiver: k.receiver as unknown as {
			id: string;
			name: string;
			avatar_url: string | null;
			department_name: string | null;
			kudos_received_count: number;
		},
		hashtags: (k.hashtags ?? []) as { id: string; name: string }[],
		is_liked_by_me: Array.isArray(k.is_liked_by_me)
			? k.is_liked_by_me.length > 0
			: false,
	}));

	// Transform kudos feed
	const kudos = (kudosRes.data ?? []).map((k) => ({
		...k,
		sender: k.sender as unknown as {
			id: string;
			name: string;
			avatar_url: string | null;
			department_name: string | null;
			kudos_received_count: number;
		},
		receiver: k.receiver as unknown as {
			id: string;
			name: string;
			avatar_url: string | null;
			department_name: string | null;
			kudos_received_count: number;
		},
		hashtags: (k.hashtags ?? []) as { id: string; name: string }[],
		is_liked_by_me: Array.isArray(k.is_liked_by_me)
			? k.is_liked_by_me.length > 0
			: false,
	}));

	// Transform spotlight
	const spotlightEntries = (spotlightRes.data ?? []).map((row) => {
		const r = row.receiver as unknown as { id: string; name: string };
		return {
			user_id: r?.id ?? row.receiver_id,
			name: r?.name ?? "",
			kudos_count: row.count as number,
		};
	});
	const spotlight = {
		total_kudos: spotlightEntries.reduce((sum, e) => sum + e.kudos_count, 0),
		entries: spotlightEntries,
	};

	// Transform stats
	const stats = (statsRes.data as {
		kudos_received: number;
		kudos_sent: number;
		hearts_received: number;
		secret_boxes_opened: number;
		secret_boxes_unopened: number;
	}) ?? {
		kudos_received: 0,
		kudos_sent: 0,
		hearts_received: 0,
		secret_boxes_opened: 0,
		secret_boxes_unopened: 0,
	};

	// Transform top gifts
	const topGifts = (topGiftsRes.data ?? []).map((row) => {
		const u = row.user as unknown as {
			id: string;
			name: string;
			avatar_url: string | null;
		};
		return {
			user_id: u?.id ?? "",
			name: u?.name ?? "",
			avatar_url: u?.avatar_url ?? null,
			gift_description: String(row.reward_content ?? ""),
		};
	});

	return (
		<main className="min-h-screen bg-[var(--klb-color-bg-primary)]">
			<Header lang={lang} activePage="kudo-live" />
			<KudosLiveBoardClient
				initialHighlights={highlights}
				initialKudos={kudos}
				initialHasMore={kudos.length >= 20}
				currentUserId={user.id}
				initialStats={stats}
				initialTopGifts={topGifts}
				initialSpotlight={spotlight}
				lang={lang}
			/>
			<Footer lang={lang} />
		</main>
	);
}
