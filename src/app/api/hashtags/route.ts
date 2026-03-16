import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function GET() {
	try {
		const auth = await getApiAuth();
		if (auth instanceof NextResponse) return auth;
		const { supabase } = auth;

		const { data, error } = await supabase
			.from("hashtags")
			.select("id, name")
			.order("name", { ascending: true });

		if (error) {
			console.error("[API /api/hashtags] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to fetch hashtags", details: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ data: data ?? [] });
	} catch (err) {
		console.error("[API /api/hashtags] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
