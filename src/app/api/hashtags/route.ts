import { NextRequest, NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";
import { CreateHashtagSchema } from "@/types/kudos";

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
		console.error("[API /api/hashtags GET] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const parsed = CreateHashtagSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request body", details: parsed.error.flatten() },
				{ status: 400 },
			);
		}

		const { name } = parsed.data;

		const auth = await getApiAuth();
		if (auth instanceof NextResponse) return auth;
		const { supabase } = auth;

		// Check if hashtag already exists (case-insensitive)
		const { data: existing } = await supabase
			.from("hashtags")
			.select("id, name")
			.ilike("name", name)
			.limit(1)
			.single();

		if (existing) {
			return NextResponse.json({ data: existing }, { status: 200 });
		}

		// Create new hashtag
		const { data: created, error } = await supabase
			.from("hashtags")
			.insert({ name })
			.select("id, name")
			.single();

		if (error) {
			console.error("[API /api/hashtags POST] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to create hashtag", details: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ data: created }, { status: 201 });
	} catch (err) {
		console.error("[API /api/hashtags POST] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
