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

describe("GET /api/sunners/top-gifts", () => {
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

	it("returns top 10 gift recipients", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					order: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue({
							data: [
								{
									id: "box-1",
									reward_content: "Điểm thưởng +50",
									opened_at: "2026-03-13T10:30:00Z",
									user: {
										id: "u1",
										name: "Nguyễn Duy Khánh",
										avatar_url: "https://example.com/a.png",
									},
								},
								{
									id: "box-2",
									reward_content: "Voucher 500k",
									opened_at: "2026-03-12T08:00:00Z",
									user: {
										id: "u2",
										name: "Trần Minh Tú",
										avatar_url: null,
									},
								},
							],
							error: null,
						}),
					}),
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.items).toHaveLength(2);
		expect(body.items[0]).toHaveProperty("user_id");
		expect(body.items[0]).toHaveProperty("name");
		expect(body.items[0]).toHaveProperty("gift_description");
	});

	it("returns empty array when no gifts", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					order: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue({
							data: [],
							error: null,
						}),
					}),
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.items).toHaveLength(0);
	});
});
