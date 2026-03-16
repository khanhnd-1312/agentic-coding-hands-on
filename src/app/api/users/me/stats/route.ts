import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Kudos received count
		const { data: receivedData, error: receivedError } = await supabase
			.from("kudos")
			.select("count", { count: "exact", head: true })
			.eq("receiver_id", user.id);

		if (receivedError) throw receivedError;

		// Kudos sent count
		const { data: sentData, error: sentError } = await supabase
			.from("kudos")
			.select("count", { count: "exact", head: true })
			.eq("sender_id", user.id);

		if (sentError) throw sentError;

		// Hearts received: count hearts on kudos where user is sender
		const { data: heartsData, error: heartsError } = await supabase
			.from("kudos_hearts")
			.select("count", { count: "exact", head: true })
			.eq("user_id", user.id);

		if (heartsError) throw heartsError;

		// Secret boxes opened
		const { data: openedData, error: openedError } = await supabase
			.from("secret_boxes")
			.select("count", { count: "exact", head: true })
			.eq("user_id", user.id)
			.eq("is_opened", true);

		if (openedError) throw openedError;

		// Secret boxes unopened
		const { data: unopenedData, error: unopenedError } = await supabase
			.from("secret_boxes")
			.select("count", { count: "exact", head: true })
			.eq("user_id", user.id)
			.eq("is_opened", false);

		if (unopenedError) throw unopenedError;

		return NextResponse.json({
			kudos_received: Number(receivedData) || 0,
			kudos_sent: Number(sentData) || 0,
			hearts_received: Number(heartsData) || 0,
			secret_boxes_opened: Number(openedData) || 0,
			secret_boxes_unopened: Number(unopenedData) || 0,
		});
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch user stats" },
			{ status: 500 },
		);
	}
}
