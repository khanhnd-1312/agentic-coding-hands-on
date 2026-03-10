import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/middleware";

export async function middleware(request: NextRequest) {
	const { supabase, supabaseResponse } = createClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;

	// Authenticated user visiting /login → redirect to homepage
	if (user && pathname === "/login") {
		return NextResponse.redirect(new URL("/", request.url), { status: 307 });
	}

	// Unauthenticated user visiting a protected route → redirect to /login
	if (!user && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", request.url), {
			status: 307,
		});
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		"/((?!auth/callback|_next/static|_next/image|favicon.ico|images).*)",
	],
};
