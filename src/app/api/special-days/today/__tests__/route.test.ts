import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

describe("GET /api/special-days/today", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const { GET } = await import("../route");
		const response = await GET();
		expect(response.status).toBe(401);
	});

	it("returns is_special_day: false when no special day today", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({
						data: null,
						error: { code: "PGRST116" },
					}),
				}),
			}),
		});

		const { GET } = await import("../route");
		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.is_special_day).toBe(false);
		expect(body.multiplier).toBe(1);
	});

	it("returns is_special_day: true with multiplier when special day exists", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({
						data: { multiplier: 2 },
						error: null,
					}),
				}),
			}),
		});

		const { GET } = await import("../route");
		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.is_special_day).toBe(true);
		expect(body.multiplier).toBe(2);
	});
});
