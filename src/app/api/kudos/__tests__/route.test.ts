import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase server client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockOr = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: {
			getUser: () => mockGetUser(),
		},
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

function createRequest(params: Record<string, string> = {}) {
	const url = new URL("http://localhost:3000/api/kudos");
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return new NextRequest(url);
}

describe("GET /api/kudos", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});

		// Chain: from().select().order().range()
		mockRange.mockResolvedValue({
			data: [
				{
					id: "k1",
					sender_id: "user-1",
					receiver_id: "user-2",
					content: "Great work!",
					images: [],
					heart_count: 5,
					created_at: "2025-10-30T10:00:00Z",
					sender: {
						id: "user-1",
						name: "Sender",
						avatar_url: null,
						department_id: null,
						kudos_received_count: 10,
					},
					receiver: {
						id: "user-2",
						name: "Receiver",
						avatar_url: null,
						department_id: null,
						kudos_received_count: 5,
					},
					kudos_hashtags: [
						{ hashtag: { id: "h1", name: "#Dedicated" } },
					],
					kudos_hearts: [],
				},
			],
			count: 1,
			error: null,
		});
		mockOr.mockReturnValue({ range: mockRange });
		mockOrder.mockReturnValue({ range: mockRange, or: mockOr });
		mockSelect.mockReturnValue({ order: mockOrder });
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") {
				return { select: mockSelect };
			}
			// departments lookup
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
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const { GET } = await import("../route");
		const response = await GET(createRequest());
		expect(response.status).toBe(401);
	});

	it("returns 400 for invalid page parameter", async () => {
		const { GET } = await import("../route");
		const response = await GET(createRequest({ page: "-1" }));
		expect(response.status).toBe(400);
	});

	it("returns paginated kudos list with correct shape", async () => {
		const { GET } = await import("../route");
		const response = await GET(createRequest({ page: "1", limit: "20" }));
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("data");
		expect(body).toHaveProperty("page");
		expect(body).toHaveProperty("limit");
		expect(body).toHaveProperty("total");
		expect(body).toHaveProperty("has_more");
		expect(Array.isArray(body.data)).toBe(true);
	});

	it("each kudos item has sender, receiver, hashtags, is_liked_by_me", async () => {
		const { GET } = await import("../route");
		const response = await GET(createRequest());
		const body = await response.json();
		const item = body.data[0];

		expect(item).toHaveProperty("sender");
		expect(item).toHaveProperty("receiver");
		expect(item).toHaveProperty("hashtags");
		expect(item).toHaveProperty("is_liked_by_me");
		expect(item.sender).toHaveProperty("id");
		expect(item.sender).toHaveProperty("name");
		expect(item.sender).toHaveProperty("department_name");
		expect(item.receiver).toHaveProperty("id");
	});

	it("defaults to page 1, limit 20", async () => {
		const { GET } = await import("../route");
		const response = await GET(createRequest());
		const body = await response.json();
		expect(body.page).toBe(1);
		expect(body.limit).toBe(20);
	});

	it("returns 500 on supabase query error", async () => {
		mockRange.mockResolvedValue({
			data: null,
			count: null,
			error: { message: "DB error" },
		});

		const { GET } = await import("../route");
		const response = await GET(createRequest());
		expect(response.status).toBe(500);
	});
});
