import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the supabase middleware client
vi.mock("@/libs/supabase/middleware", () => ({
	createClient: vi.fn(),
}));

const makeRequest = (pathname: string) =>
	new NextRequest(new URL(pathname, "http://localhost:3000"));

describe("middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects unauthenticated request to protected route → /login", async () => {
		const { createClient } = await import("@/libs/supabase/middleware");
		vi.mocked(createClient).mockReturnValue({
			supabase: {
				auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
			},
			supabaseResponse: new (await import("next/server")).NextResponse(),
		} as never);

		const { middleware } = await import("./middleware");
		const req = makeRequest("/dashboard");
		const res = await middleware(req);

		expect(res?.status).toBe(307);
		expect(res?.headers.get("location")).toContain("/login");
	});

	it("redirects authenticated user visiting /login → /", async () => {
		const { createClient } = await import("@/libs/supabase/middleware");
		vi.mocked(createClient).mockReturnValue({
			supabase: {
				auth: {
					getUser: vi
						.fn()
						.mockResolvedValue({ data: { user: { id: "user-1" } } }),
				},
			},
			supabaseResponse: new (await import("next/server")).NextResponse(),
		} as never);

		const { middleware } = await import("./middleware");
		const req = makeRequest("/login");
		const res = await middleware(req);

		expect(res?.status).toBe(307);
		expect(res?.headers.get("location")).toContain("/");
	});

	it("passes through unauthenticated request to /login (public route)", async () => {
		const { createClient } = await import("@/libs/supabase/middleware");
		const { NextResponse } = await import("next/server");
		const supabaseResponse = NextResponse.next();
		vi.mocked(createClient).mockReturnValue({
			supabase: {
				auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
			},
			supabaseResponse,
		} as never);

		const { middleware } = await import("./middleware");
		const req = makeRequest("/login");
		const res = await middleware(req);

		// Should return the supabaseResponse (pass through), not a redirect to /login
		const location = res?.headers.get("location");
		// location is null for a pass-through NextResponse — not a redirect loop
		expect(location).toBeNull();
	});

	it("passes through requests to /auth/callback (matcher excludes it)", async () => {
		const { config } = await import("./middleware");
		// The matcher must contain auth/callback in its exclusion list
		const matcherStr = JSON.stringify(config.matcher);
		expect(matcherStr).toContain("auth/callback");
	});

	it("passes through requests to /_next/static paths (matcher excludes them)", async () => {
		const { config } = await import("./middleware");
		expect(config.matcher).toBeDefined();
		// The matcher pattern must exclude _next paths
		const matcherStr = JSON.stringify(config.matcher);
		expect(matcherStr).toContain("_next");
	});
});
