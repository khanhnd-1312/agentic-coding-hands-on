import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

describe("POST /api/users/me/secret-box", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const response = await POST();
		expect(response.status).toBe(401);
	});

	it("returns 404 when no unopened secret boxes", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					eq: vi.fn().mockReturnValue({
						limit: vi.fn().mockReturnValue({
							single: vi.fn().mockResolvedValue({
								data: null,
								error: { code: "PGRST116" },
							}),
						}),
					}),
				}),
			}),
		});

		const response = await POST();
		expect(response.status).toBe(404);
	});

	it("opens a secret box and returns reward", async () => {
		const boxId = "box-1";
		// Mock finding an unopened box
		mockFrom.mockImplementation((table: string) => {
			if (table === "secret_boxes") {
				return {
					select: vi.fn().mockReturnValue({
						eq: vi.fn().mockReturnValue({
							eq: vi.fn().mockReturnValue({
								limit: vi.fn().mockReturnValue({
									single: vi.fn().mockResolvedValue({
										data: {
											id: boxId,
											reward_content: "Điểm thưởng +50",
										},
										error: null,
									}),
								}),
							}),
						}),
					}),
					update: vi.fn().mockReturnValue({
						eq: vi.fn().mockReturnValue({
							select: vi.fn().mockReturnValue({
								single: vi.fn().mockResolvedValue({
									data: {
										id: boxId,
										reward_content: "Điểm thưởng +50",
										opened_at: "2026-03-13T10:30:00Z",
									},
									error: null,
								}),
							}),
						}),
					}),
				};
			}
			return {};
		});

		const response = await POST();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("id");
		expect(body).toHaveProperty("reward_content");
		expect(body).toHaveProperty("opened_at");
	});
});
