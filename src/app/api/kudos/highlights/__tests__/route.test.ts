import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

function createRequest(params: Record<string, string> = {}) {
	const url = new URL("http://localhost:3000/api/kudos/highlights");
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return new NextRequest(url);
}

describe("GET /api/kudos/highlights", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const { GET } = await import("../route");
		const response = await GET(createRequest());
		expect(response.status).toBe(401);
	});

	it("returns top 5 kudos ordered by heart_count", async () => {
		const mockData = Array.from({ length: 5 }, (_, i) => ({
			id: `k${i + 1}`,
			sender_id: "s1",
			receiver_id: "r1",
			content: `Kudos ${i + 1}`,
			images: [],
			heart_count: 100 - i * 10,
			created_at: "2025-10-30T10:00:00Z",
			sender: {
				id: "s1",
				name: "Sender",
				avatar_url: null,
				department_id: null,
				kudos_received_count: 10,
			},
			receiver: {
				id: "r1",
				name: "Receiver",
				avatar_url: null,
				department_id: null,
				kudos_received_count: 5,
			},
			kudos_hashtags: [],
			kudos_hearts: [],
		}));

		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") {
				return {
					select: vi.fn().mockReturnValue({
						order: vi.fn().mockReturnValue({
							limit: vi.fn().mockResolvedValue({
								data: mockData,
								error: null,
							}),
						}),
					}),
				};
			}
			return {
				select: vi.fn().mockReturnValue({
					eq: vi.fn().mockReturnValue({
						single: vi
							.fn()
							.mockResolvedValue({ data: null, error: null }),
					}),
				}),
			};
		});

		const { GET } = await import("../route");
		const response = await GET(createRequest());
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.data).toHaveLength(5);
	});

	it("returns empty array when no highlights exist", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") {
				return {
					select: vi.fn().mockReturnValue({
						order: vi.fn().mockReturnValue({
							limit: vi.fn().mockResolvedValue({
								data: [],
								error: null,
							}),
						}),
					}),
				};
			}
			return {};
		});

		const { GET } = await import("../route");
		const response = await GET(createRequest());
		const body = await response.json();
		expect(body.data).toHaveLength(0);
	});
});
