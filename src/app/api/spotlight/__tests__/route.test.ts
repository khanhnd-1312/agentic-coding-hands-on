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

describe("GET /api/spotlight", () => {
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

	it("returns spotlight data with entries and total", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				order: vi.fn().mockResolvedValue({
					data: [
						{
							receiver_id: "u1",
							count: 50,
							receiver: { id: "u1", name: "Nguyễn Duy Khánh" },
						},
						{
							receiver_id: "u2",
							count: 30,
							receiver: { id: "u2", name: "Trần Minh Tú" },
						},
					],
					error: null,
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("total_kudos");
		expect(body).toHaveProperty("entries");
		expect(body.entries).toHaveLength(2);
		expect(body.entries[0]).toHaveProperty("name");
		expect(body.entries[0]).toHaveProperty("user_id");
		expect(body.entries[0]).toHaveProperty("kudos_count");
	});

	it("returns empty entries when no kudos", async () => {
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnValue({
				order: vi.fn().mockResolvedValue({
					data: [],
					error: null,
				}),
			}),
		});

		const response = await GET();
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.total_kudos).toBe(0);
		expect(body.entries).toHaveLength(0);
	});
});
