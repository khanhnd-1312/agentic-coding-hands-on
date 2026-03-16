import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function GET() {
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase } = auth;

	try {
		// Get all kudos with receiver profiles to aggregate counts
		const { data: kudosList, error } = await supabase
			.from("kudos")
			.select("receiver_id, receiver:profiles!kudos_receiver_id_fkey(id, name)");

		if (error) {
			console.error("[API /api/spotlight] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to fetch spotlight data" },
				{ status: 500 },
			);
		}

		// Aggregate kudos per receiver
		const countMap = new Map<
			string,
			{ name: string; count: number }
		>();

		for (const k of kudosList ?? []) {
			const receiver = k.receiver as unknown as {
				id: string;
				name: string;
			} | null;
			const id = receiver?.id ?? (k.receiver_id as string);
			const existing = countMap.get(id);
			if (existing) {
				existing.count++;
			} else {
				countMap.set(id, {
					name: receiver?.name ?? "",
					count: 1,
				});
			}
		}

		const entries = Array.from(countMap.entries())
			.map(([user_id, { name, count }]) => ({
				user_id,
				name,
				kudos_count: count,
			}))
			.sort((a, b) => b.kudos_count - a.kudos_count);

		const total_kudos = entries.reduce((sum, e) => sum + e.kudos_count, 0);

		return NextResponse.json({ total_kudos, entries });
	} catch (err) {
		console.error("[API /api/spotlight] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
