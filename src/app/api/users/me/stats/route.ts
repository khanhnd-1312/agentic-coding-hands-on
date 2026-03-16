import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function GET() {
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase, userId } = auth;

	const uid = userId ?? "";

	try {
		// Run all count queries in parallel
		const [received, sent, hearts, opened, unopened] = await Promise.all([
			supabase.from("kudos").select("id").eq("receiver_id", uid),
			supabase.from("kudos").select("id").eq("sender_id", uid),
			supabase.from("kudos_hearts").select("id").eq("user_id", uid),
			supabase.from("secret_boxes").select("id").eq("user_id", uid).eq("is_opened", true),
			supabase.from("secret_boxes").select("id").eq("user_id", uid).eq("is_opened", false),
		]);

		return NextResponse.json({
			kudos_received: received.data?.length ?? 0,
			kudos_sent: sent.data?.length ?? 0,
			hearts_received: hearts.data?.length ?? 0,
			secret_boxes_opened: opened.data?.length ?? 0,
			secret_boxes_unopened: unopened.data?.length ?? 0,
		});
	} catch (err) {
		console.error("[API /api/users/me/stats] Error:", err);
		return NextResponse.json(
			{ error: "Failed to fetch user stats" },
			{ status: 500 },
		);
	}
}
