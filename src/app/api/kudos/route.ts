import { NextRequest, NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";
import { KudosListQuerySchema, CreateKudoSchema } from "@/types/kudos";
import type { KudosListResponse } from "@/types/kudos";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const parsed = KudosListQuerySchema.safeParse({
			page: searchParams.get("page") ?? undefined,
			limit: searchParams.get("limit") ?? undefined,
			hashtag: searchParams.get("hashtag") ?? undefined,
			department: searchParams.get("department") ?? undefined,
		});

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid query parameters", details: parsed.error.flatten() },
				{ status: 400 },
			);
		}

		const { page, limit, hashtag, department } = parsed.data;
		const offset = (page - 1) * limit;

		const auth = await getApiAuth();
		if (auth instanceof NextResponse) return auth;
		const { supabase, userId } = auth;

		// Build query for kudos with sender/receiver joins
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
				kudos_hearts(user_id)
			`,
				{ count: "exact" },
			)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		// Filter by hashtag
		if (hashtag) {
			query = query.eq("kudos_hashtags.hashtag_id", hashtag);
		}

		// Filter by department (sender OR receiver)
		if (department) {
			query = query.or(
				`sender_id.in.(select id from profiles where department_id=eq.${department}),receiver_id.in.(select id from profiles where department_id=eq.${department})`,
			);
		}

		const { data: kudosList, count, error } = await query;

		if (error) {
			console.error("[API /api/kudos] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to fetch kudos", details: error.message },
				{ status: 500 },
			);
		}

		const total = count ?? 0;

		// Transform response: resolve department names, flatten hashtags, compute is_liked_by_me
		const data = await Promise.all(
			(kudosList ?? []).map(async (k: Record<string, unknown>) => {
				const sender = k.sender as Record<string, unknown> | null;
				const receiver = k.receiver as Record<string, unknown> | null;

				// Resolve department names
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

				// Flatten hashtags from join table
				const rawHashtags = k.kudos_hashtags as
					| Array<{ hashtag: { id: string; name: string } | null }>
					| null;
				const kudosHashtags = (rawHashtags ?? [])
					.map((kh) => kh.hashtag)
					.filter(Boolean);

				// Check if current user liked this kudos
				const hearts = (k.kudos_hearts as Array<{ user_id: string }>) ?? [];
				const isLikedByMe = userId ? hearts.some((h) => h.user_id === userId) : false;
				const isMyKudo = userId ? (k.sender_id as string) === userId : false;

				return {
					id: k.id as string,
					sender_id: k.sender_id as string,
					receiver_id: k.receiver_id as string,
					title: (k.title as string) ?? "",
					content: k.content as Record<string, unknown>,
					is_anonymous: (k.is_anonymous as boolean) ?? false,
					images: (k.images as string[]) ?? [],
					heart_count: (k.heart_count as number) ?? 0,
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
					is_my_kudo: isMyKudo,
				};
			}),
		);

		const response: KudosListResponse = {
			data,
			page,
			limit,
			total,
			has_more: offset + limit < total,
		};

		return NextResponse.json(response);
	} catch (err) {
		console.error("[API /api/kudos GET] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const parsed = CreateKudoSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request body", details: parsed.error.flatten() },
				{ status: 400 },
			);
		}

		const { receiver_id, title, content, hashtag_ids, image_urls, is_anonymous } = parsed.data;

		const auth = await getApiAuth();
		if (auth instanceof NextResponse) return auth;
		const { supabase, userId } = auth;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Verify receiver exists
		const { data: receiver, error: receiverError } = await supabase
			.from("profiles")
			.select("id")
			.eq("id", receiver_id)
			.single();

		if (receiverError || !receiver) {
			return NextResponse.json(
				{ error: "Người nhận không hợp lệ" },
				{ status: 422 },
			);
		}

		// Insert kudo
		const { data: kudo, error: kudoError } = await supabase
			.from("kudos")
			.insert({
				sender_id: userId,
				receiver_id,
				title,
				content,
				is_anonymous,
				images: image_urls,
			})
			.select("id, sender_id, receiver_id, title, content, is_anonymous, images, heart_count, created_at")
			.single();

		if (kudoError) {
			console.error("[API /api/kudos POST] Insert error:", kudoError.message);
			return NextResponse.json(
				{ error: "Failed to create kudo", details: kudoError.message },
				{ status: 500 },
			);
		}

		// Insert hashtag associations
		if (hashtag_ids.length > 0) {
			const hashtagRows = hashtag_ids.map((hashtag_id) => ({
				kudos_id: kudo.id,
				hashtag_id,
			}));

			const { error: hashtagError } = await supabase
				.from("kudos_hashtags")
				.insert(hashtagRows);

			if (hashtagError) {
				console.error("[API /api/kudos POST] Hashtag insert error:", hashtagError.message);
				// Kudo was created but hashtags failed — log but don't fail the whole request
			}
		}

		return NextResponse.json({ data: kudo }, { status: 201 });
	} catch (err) {
		console.error("[API /api/kudos POST] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
