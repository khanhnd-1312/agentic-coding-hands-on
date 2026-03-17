import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

function createRequest(params: Record<string, string> = {}) {
	const url = new URL("http://localhost:3000/api/users/search");
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return new NextRequest(url);
}

describe("GET /api/users/search", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
	});

	it("returns matching profiles", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "profiles") {
				return {
					select: () => ({
						ilike: () => ({
							limit: () => Promise.resolve({
								data: [
									{ id: "u1", name: "Nguyễn Văn A", avatar_url: null, department_id: "d1" },
									{ id: "u2", name: "Nguyễn Thị B", avatar_url: null, department_id: null },
								],
								error: null,
							}),
						}),
					}),
				};
			}
			if (table === "departments") {
				return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { name: "Engineering" }, error: null }) }) }) };
			}
			return {};
		});

		
		const res = await GET(createRequest({ q: "Nguyễn" }));
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.data).toHaveLength(2);
		expect(body.data[0].name).toBe("Nguyễn Văn A");
		expect(body.data[0].department_name).toBe("Engineering");
	});

	it("returns 400 when q is missing", async () => {
		
		const res = await GET(createRequest({}));
		expect(res.status).toBe(400);
	});

	it("returns empty array when no results", async () => {
		mockFrom.mockImplementation(() => ({
			select: () => ({
				ilike: () => ({
					limit: () => Promise.resolve({ data: [], error: null }),
				}),
			}),
		}));

		
		const res = await GET(createRequest({ q: "zzz" }));
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.data).toHaveLength(0);
	});

	it("limits results to 10", async () => {
		const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
		mockFrom.mockImplementation(() => ({
			select: () => ({
				ilike: () => ({
					limit: mockLimit,
				}),
			}),
		}));

		
		await GET(createRequest({ q: "test" }));
		expect(mockLimit).toHaveBeenCalledWith(10);
	});
});
