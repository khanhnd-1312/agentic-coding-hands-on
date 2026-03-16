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

describe("GET /api/departments", () => {
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

	it("returns all departments", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				order: vi.fn().mockResolvedValue({
					data: [
						{ id: "d1", name: "Engineering" },
						{ id: "d2", name: "Design" },
					],
					error: null,
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.data).toHaveLength(2);
		expect(body.data[0]).toHaveProperty("id");
		expect(body.data[0]).toHaveProperty("name");
	});

	it("returns 500 on database error", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				order: vi.fn().mockResolvedValue({
					data: null,
					error: { message: "DB error" },
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(500);
	});
});
