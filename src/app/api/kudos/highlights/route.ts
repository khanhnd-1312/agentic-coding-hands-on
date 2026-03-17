import { NextRequest, NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";
import { KudosHighlightsQuerySchema } from "@/types/kudos";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const parsed = KudosHighlightsQuerySchema.safeParse({
		hashtag: searchParams.get("hashtag") ?? undefined,
		department: searchParams.get("department") ?? undefined,
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid query parameters", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase, userId } = auth;

	// Fetch top 5 kudos by heart_count
	let query = supabase
		.from("kudos")
		.select(
			`
			id,
			sender_id,
			receiver_id,
			title,
			content,
			is_anonymous,
			images,
			heart_count,
			created_at,
			sender:profiles!kudos_sender_id_fkey(id, name, avatar_url, department_id, kudos_received_count),
			receiver:profiles!kudos_receiver_id_fkey(id, name, avatar_url, department_id, kudos_received_count),
			kudos_hashtags(hashtag:hashtags(id, name)),
			kudos_hearts!left(user_id)
		`,
		)
		.order("heart_count", { ascending: false })
		.limit(5);

	// Apply optional filters (same as main kudos feed)
	if (parsed.data.hashtag) {
		query = query.eq("kudos_hashtags.hashtag_id", parsed.data.hashtag);
	}

	const { data: kudosList, error } = await query;

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch highlights", details: error.message },
			{ status: 500 },
		);
	}

	// Transform: resolve department names, flatten hashtags, compute is_liked_by_me
	const data = await Promise.all(
		(kudosList ?? []).map(async (k: Record<string, unknown>) => {
			const sender = k.sender as Record<string, unknown> | null;
			const receiver = k.receiver as Record<string, unknown> | null;

			let senderDeptName: string | null = null;
			let receiverDeptName: string | null = null;

			if (sender?.department_id) {
				const { data: dept } = await supabase
					.from("departments")
					.select("name")
					.eq("id", sender.department_id as string)
					.single();
				senderDeptName = dept?.name ?? null;
			}

			if (receiver?.department_id) {
				const { data: dept } = await supabase
					.from("departments")
					.select("name")
					.eq("id", receiver.department_id as string)
					.single();
				receiverDeptName = dept?.name ?? null;
			}

			const kudosHashtags = (
				k.kudos_hashtags as Array<{
					hashtag: { id: string; name: string } | null;
				}>
			)
				.map((kh) => kh.hashtag)
				.filter(Boolean);

			const hearts = k.kudos_hearts as Array<{ user_id: string }>;
			const isLikedByMe = hearts.some((h) => h.user_id === (userId ?? ""));

			return {
				id: k.id as string,
				sender_id: k.sender_id as string,
				receiver_id: k.receiver_id as string,
				title: (k.title as string) ?? "",
				content: k.content as Record<string, unknown>,
				is_anonymous: (k.is_anonymous as boolean) ?? false,
				images: k.images as string[],
				heart_count: k.heart_count as number,
				created_at: k.created_at as string,
				sender: {
					id: String(sender?.id ?? ""),
					name: String(sender?.name ?? ""),
					avatar_url: (sender?.avatar_url as string | null) ?? null,
					department_name: senderDeptName,
					kudos_received_count: Number(sender?.kudos_received_count ?? 0),
				},
				receiver: {
					id: String(receiver?.id ?? ""),
					name: String(receiver?.name ?? ""),
					avatar_url: (receiver?.avatar_url as string | null) ?? null,
					department_name: receiverDeptName,
					kudos_received_count: Number(receiver?.kudos_received_count ?? 0),
				},
				hashtags: kudosHashtags as Array<{ id: string; name: string }>,
				is_liked_by_me: isLikedByMe,
			};
		}),
	);

	return NextResponse.json({ data });
}
