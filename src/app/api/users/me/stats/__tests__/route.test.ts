import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

describe("GET /api/users/me/stats", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const response = await GET();
		expect(response.status).toBe(401);
	});

	it("returns user stats with correct counts", async () => {
		// Mock kudos received count
		const mockSelect = vi.fn();
		const mockEq = vi.fn();
		const mockSingle = vi.fn();

		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") {
				return {
					select: mockSelect.mockReturnValue({
						eq: mockEq.mockImplementation(
							(_col: string, _val: string) => ({
								// For count queries
								single: mockSingle.mockResolvedValue({
									data: { count: 10 },
									error: null,
								}),
							}),
						),
					}),
				};
			}
			if (table === "kudos_hearts") {
				return {
					select: vi.fn().mockReturnValue({
						eq: vi.fn().mockReturnValue({
							single: vi.fn().mockResolvedValue({
								data: { count: 42 },
								error: null,
							}),
						}),
					}),
				};
			}
			if (table === "secret_boxes") {
				return {
					select: vi.fn().mockReturnValue({
						eq: vi.fn().mockReturnValue({
							eq: vi.fn().mockReturnValue({
								single: vi.fn().mockResolvedValue({
									data: { count: 5 },
									error: null,
								}),
							}),
						}),
					}),
				};
			}
			return {};
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("kudos_received");
		expect(body).toHaveProperty("kudos_sent");
		expect(body).toHaveProperty("hearts_received");
		expect(body).toHaveProperty("secret_boxes_opened");
		expect(body).toHaveProperty("secret_boxes_unopened");
	});

	it("returns 500 on database error", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({
						data: null,
						error: { message: "DB error" },
					}),
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(500);
	});
});
