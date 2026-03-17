import { NextRequest, NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";
import { UserSearchQuerySchema } from "@/types/kudos";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const parsed = UserSearchQuerySchema.safeParse({
			q: searchParams.get("q") ?? undefined,
		});

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid query parameters", details: parsed.error.flatten() },
				{ status: 400 },
			);
		}

		const { q } = parsed.data;

		const auth = await getApiAuth();
		if (auth instanceof NextResponse) return auth;
		const { supabase } = auth;

		const { data, error } = await supabase
			.from("profiles")
			.select("id, name, avatar_url, department_id")
			.ilike("name", `%${q}%`)
			.limit(10);

		if (error) {
			console.error("[API /api/users/search] Supabase error:", error.message);
			return NextResponse.json(
				{ error: "Failed to search users", details: error.message },
				{ status: 500 },
			);
		}

		// Resolve department names
		const results = await Promise.all(
			(data ?? []).map(async (profile) => {
				let departmentName: string | null = null;
				if (profile.department_id) {
					const { data: dept } = await supabase
						.from("departments")
						.select("name")
						.eq("id", profile.department_id)
						.single();
					departmentName = dept?.name ?? null;
				}
				return {
					id: profile.id,
					name: profile.name,
					avatar_url: profile.avatar_url,
					department_name: departmentName,
				};
			}),
		);

		return NextResponse.json({ data: results });
	} catch (err) {
		console.error("[API /api/users/search] Unexpected error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
