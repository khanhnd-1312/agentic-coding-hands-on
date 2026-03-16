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

	const { data, error } = await supabase
		.from("kudos_receiver_counts")
		.select("receiver_id, count, receiver:profiles!kudos_receiver_counts_receiver_id_fkey(id, name)")
		.order("count", { ascending: false });

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch spotlight data" },
			{ status: 500 },
		);
	}

	const entries = (data ?? []).map((row) => {
		const r = row.receiver as unknown as { id: string; name: string };
		return {
			user_id: r?.id ?? row.receiver_id,
			name: r?.name ?? "",
			kudos_count: row.count as number,
		};
	});

	const total_kudos = entries.reduce((sum, e) => sum + e.kudos_count, 0);

	return NextResponse.json({ total_kudos, entries });
}
