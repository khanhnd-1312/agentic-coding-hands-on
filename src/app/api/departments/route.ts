import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { data, error } = await supabase
			.from("departments")
			.select("id, name")
			.order("name", { ascending: true });

		if (error) {
			console.error("[API /api/departments] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to fetch departments", details: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ data: data ?? [] });
	} catch (err) {
		console.error("[API /api/departments] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
