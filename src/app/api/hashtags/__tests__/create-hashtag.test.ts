import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
	}),
}));

function createPostRequest(body: Record<string, unknown>) {
	return new NextRequest("http://localhost:3000/api/hashtags", {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});
}

describe("POST /api/hashtags", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
	});

	it("creates new hashtag and returns 201", async () => {
		mockFrom.mockImplementation(() => ({
			select: () => ({
				ilike: () => ({
					limit: () => ({
						single: () => Promise.resolve({ data: null, error: { code: "PGRST116" } }),
					}),
				}),
			}),
			insert: () => ({
				select: () => ({
					single: () => Promise.resolve({
						data: { id: "h1", name: "teamwork" },
						error: null,
					}),
				}),
			}),
		}));

		
		const res = await POST(createPostRequest({ name: "teamwork" }));
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.data.name).toBe("teamwork");
	});

	it("returns existing hashtag with 200 when duplicate", async () => {
		mockFrom.mockImplementation(() => ({
			select: () => ({
				ilike: () => ({
					limit: () => ({
						single: () => Promise.resolve({
							data: { id: "h1", name: "teamwork" },
							error: null,
						}),
					}),
				}),
			}),
		}));

		
		const res = await POST(createPostRequest({ name: "teamwork" }));
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.data.id).toBe("h1");
	});

	it("returns 400 when name is empty", async () => {
		
		const res = await POST(createPostRequest({ name: "" }));
		expect(res.status).toBe(400);
	});

	it("returns 400 when name is missing", async () => {
		
		const res = await POST(createPostRequest({}));
		expect(res.status).toBe(400);
	});
});
