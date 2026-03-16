import { NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase } = auth;

	const { id } = await params;

	const { data, error } = await supabase
		.from("profiles")
		.select("id, name, avatar_url, department_name, kudos_received_count, title")
		.eq("id", id)
		.single();

	if (error || !data) {
		return NextResponse.json(
			{ error: "User not found" },
			{ status: 404 },
		);
	}

	return NextResponse.json(data);
}
