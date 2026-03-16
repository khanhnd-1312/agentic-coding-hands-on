import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function GET() {
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase } = auth;

	const { data, error } = await supabase
		.from("secret_boxes")
		.select("id, reward_content, opened_at, user:profiles!secret_boxes_user_id_fkey(id, name, avatar_url)")
		.eq("is_opened", true)
		.order("opened_at", { ascending: false })
		.limit(10);

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch top gifts" },
			{ status: 500 },
		);
	}

	const items = (data ?? []).map((row) => {
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

	return NextResponse.json({ items });
}
