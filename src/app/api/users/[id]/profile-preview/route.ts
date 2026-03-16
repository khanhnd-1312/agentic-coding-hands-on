import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

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
