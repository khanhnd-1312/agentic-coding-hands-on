import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function POST() {
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase, userId } = auth;

	// Find an unopened secret box
	const { data: box, error: findError } = await supabase
		.from("secret_boxes")
		.select("id, reward_content")
		.eq("user_id", userId ?? "")
		.eq("is_opened", false)
		.limit(1)
		.single();

	if (findError) {
		if (findError.code === "PGRST116") {
			return NextResponse.json(
				{ error: "No unopened secret boxes available" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to find secret box" },
			{ status: 500 },
		);
	}

	// Open the box
	const { data: openedBox, error: updateError } = await supabase
		.from("secret_boxes")
		.update({ is_opened: true, opened_at: new Date().toISOString() })
		.eq("id", box.id)
		.select("id, reward_content, opened_at")
		.single();

	if (updateError) {
		return NextResponse.json(
			{ error: "Failed to open secret box" },
			{ status: 500 },
		);
	}

	return NextResponse.json(openedBox);
}
