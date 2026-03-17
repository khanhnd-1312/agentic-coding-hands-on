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
	return new NextRequest("http://localhost:3000/api/kudos", {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});
}

const validPayload = {
	receiver_id: "00000000-0000-0000-0000-000000000002",
	title: "Test title",
	content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }] },
	hashtag_ids: ["00000000-0000-0000-0000-000000000010"],
	image_urls: [],
	is_anonymous: false,
};

function setupSuccessMocks() {
	mockFrom.mockImplementation((table: string) => {
		if (table === "profiles") {
			return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { id: validPayload.receiver_id }, error: null }) }) }) };
		}
		if (table === "kudos") {
			return { insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "kudo-1", sender_id: "user-1", ...validPayload, heart_count: 0, created_at: "2026-01-01T00:00:00Z" }, error: null }) }) }) };
		}
		if (table === "kudos_hashtags") {
			return { insert: () => Promise.resolve({ error: null }) };
		}
		return {};
	});
}

describe("POST /api/kudos", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
	});

	it("returns 201 with all required fields", async () => {
		setupSuccessMocks();
		const res = await POST(createPostRequest(validPayload));
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.data.id).toBe("kudo-1");
	});

	it("returns 400 when required field is missing", async () => {
		const res = await POST(createPostRequest({ receiver_id: validPayload.receiver_id }));
		expect(res.status).toBe(400);
	});

	it("returns 422 when receiver_id is invalid", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "profiles") {
				return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "not found" } }) }) }) };
			}
			return {};
		});
		const res = await POST(createPostRequest(validPayload));
		expect(res.status).toBe(422);
	});

	it("succeeds with is_anonymous=true", async () => {
		setupSuccessMocks();
		const res = await POST(createPostRequest({ ...validPayload, is_anonymous: true }));
		expect(res.status).toBe(201);
	});

	it("succeeds with title exactly 50 chars", async () => {
		setupSuccessMocks();
		const res = await POST(createPostRequest({ ...validPayload, title: "A".repeat(50) }));
		expect(res.status).toBe(201);
	});

	it("rejects title over 50 chars", async () => {
		const res = await POST(createPostRequest({ ...validPayload, title: "A".repeat(51) }));
		expect(res.status).toBe(400);
	});

	it("rejects more than 5 hashtags", async () => {
		const res = await POST(createPostRequest({
			...validPayload,
			hashtag_ids: Array.from({ length: 6 }, (_, i) => `00000000-0000-0000-0000-00000000001${i}`),
		}));
		expect(res.status).toBe(400);
	});
});
