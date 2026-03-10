import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/libs/supabase/server";

const callbackSchema = z.object({
	code: z.string().optional(),
	error: z.string().optional(),
});

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const params = callbackSchema.parse({
		code: searchParams.get("code") ?? undefined,
		error: searchParams.get("error") ?? undefined,
	});

	const origin = request.nextUrl.origin;

	if (params.error) {
		return NextResponse.redirect(
			`${origin}/login?error=${encodeURIComponent(params.error)}`,
			{ status: 307 }
		);
	}

	if (params.code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(params.code);
		if (!error) {
			return NextResponse.redirect(`${origin}/`, { status: 307 });
		}
	}

	return NextResponse.redirect(`${origin}/login?error=auth_failed`, {
		status: 307,
	});
}
