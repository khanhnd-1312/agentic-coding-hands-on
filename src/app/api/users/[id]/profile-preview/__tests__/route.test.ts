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

describe("GET /api/users/[id]/profile-preview", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-1" } },
		});
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const response = await GET({} as Request, {
			params: Promise.resolve({ id: "u1" }),
		});
		expect(response.status).toBe(401);
	});

	it("returns profile preview data", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({
						data: {
							id: "u1",
							name: "Nguyễn Duy Khánh",
							avatar_url: "https://example.com/avatar.jpg",
							department_name: "Engineering",
							kudos_received_count: 25,
							title: "Senior Developer",
						},
						error: null,
					}),
				}),
			}),
		});

		const response = await GET({} as Request, {
			params: Promise.resolve({ id: "u1" }),
		});
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("id", "u1");
		expect(body).toHaveProperty("name", "Nguyễn Duy Khánh");
		expect(body).toHaveProperty("avatar_url");
		expect(body).toHaveProperty("department_name", "Engineering");
		expect(body).toHaveProperty("kudos_received_count", 25);
		expect(body).toHaveProperty("title", "Senior Developer");
	});

	it("returns 404 when user not found", async () => {
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

		const response = await GET({} as Request, {
			params: Promise.resolve({ id: "nonexistent" }),
		});
		expect(response.status).toBe(404);
	});
});
