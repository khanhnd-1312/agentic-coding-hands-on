import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import type { SpecialDayTodayResponse } from "@/types/kudos";

export async function GET() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

	const { data: specialDay, error } = await supabase
		.from("special_days")
		.select("multiplier")
		.eq("date", today)
		.single();

	if (error && error.code !== "PGRST116") {
		// PGRST116 = no rows found (not an error for our case)
		return NextResponse.json(
			{ error: "Failed to check special day", details: error.message },
			{ status: 500 },
		);
	}

	const response: SpecialDayTodayResponse = {
		is_special_day: !!specialDay,
		multiplier: specialDay?.multiplier ?? 1,
	};

	return NextResponse.json(response);
}
