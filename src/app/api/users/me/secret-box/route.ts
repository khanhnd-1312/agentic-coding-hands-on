import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Find an unopened secret box
	const { data: box, error: findError } = await supabase
		.from("secret_boxes")
		.select("id, reward_content")
		.eq("user_id", user.id)
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
