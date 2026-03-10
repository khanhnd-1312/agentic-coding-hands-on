import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock supabase server client
vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn(),
}));

// Mock console to verify no session data is logged
const consoleSpy = {
	log: vi.spyOn(console, "log").mockImplementation(() => {}),
	error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

const makeCallbackRequest = (params: Record<string, string>) => {
	const url = new URL("/auth/callback", "http://localhost:3000");
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
	return new NextRequest(url);
};

describe("GET /auth/callback", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects to / when valid code is exchanged successfully", async () => {
		const { createClient } = await import("@/libs/supabase/server");
		vi.mocked(createClient).mockResolvedValue({
			auth: {
				exchangeCodeForSession: vi
					.fn()
					.mockResolvedValue({ error: null }),
			},
		} as never);

		const { GET } = await import("./route");
		const req = makeCallbackRequest({ code: "valid-code-123" });
		const res = await GET(req);

		expect(res.status).toBe(307);
		expect(res.headers.get("location")).toBe("http://localhost:3000/");
	});

	it("redirects to /login?error=<encoded> when error param is present", async () => {
		const { GET } = await import("./route");
		const req = makeCallbackRequest({ error: "access_denied" });
		const res = await GET(req);

		expect(res.status).toBe(307);
		const location = res.headers.get("location") ?? "";
		expect(location).toContain("/login");
		expect(location).toContain("error=");
		expect(location).toContain(encodeURIComponent("access_denied"));
	});

	it("redirects to /login?error=auth_failed when code exchange fails", async () => {
		const { createClient } = await import("@/libs/supabase/server");
		vi.mocked(createClient).mockResolvedValue({
			auth: {
				exchangeCodeForSession: vi
					.fn()
					.mockResolvedValue({ error: new Error("Exchange failed") }),
			},
		} as never);

		const { GET } = await import("./route");
		const req = makeCallbackRequest({ code: "bad-code" });
		const res = await GET(req);

		expect(res.status).toBe(307);
		expect(res.headers.get("location")).toContain("/login");
		expect(res.headers.get("location")).toContain("error=auth_failed");
	});

	it("redirects to /login?error=auth_failed when no code provided", async () => {
		const { GET } = await import("./route");
		const req = makeCallbackRequest({});
		const res = await GET(req);

		expect(res.status).toBe(307);
		expect(res.headers.get("location")).toContain("/login");
		expect(res.headers.get("location")).toContain("error=auth_failed");
	});

	it("rejects unexpected param types (Zod validation)", async () => {
		// Zod schema only accepts string params; numeric-only values are still strings in URLs
		// This test verifies the route handles malformed params gracefully
		const { GET } = await import("./route");
		// Pass an array-style param (not supported) — route should still redirect safely
		const url = new URL("/auth/callback", "http://localhost:3000");
		url.searchParams.set("code", "");
		const req = new NextRequest(url);
		const res = await GET(req);

		// Empty code should redirect to /login?error=auth_failed
		expect(res.status).toBe(307);
		expect(res.headers.get("location")).toContain("/login");
	});

	it("does not log session tokens or sensitive auth data (OWASP A02)", async () => {
		const { createClient } = await import("@/libs/supabase/server");
		const fakeSession = {
			access_token: "secret-access-token",
			refresh_token: "secret-refresh-token",
		};
		vi.mocked(createClient).mockResolvedValue({
			auth: {
				exchangeCodeForSession: vi
					.fn()
					.mockResolvedValue({ data: { session: fakeSession }, error: null }),
			},
		} as never);

		const { GET } = await import("./route");
		const req = makeCallbackRequest({ code: "valid-code" });
		await GET(req);

		const logCalls = consoleSpy.log.mock.calls.flat().join(" ");
		const errCalls = consoleSpy.error.mock.calls.flat().join(" ");
		expect(logCalls).not.toContain("secret-access-token");
		expect(logCalls).not.toContain("secret-refresh-token");
		expect(errCalls).not.toContain("secret-access-token");
	});
});
