import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, DELETE } from "../route";

// Mock Supabase
const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockRpc = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
	createClient: vi.fn().mockResolvedValue({
		auth: { getUser: () => mockGetUser() },
		from: (...args: unknown[]) => mockFrom(...args),
		rpc: (...args: unknown[]) => mockRpc(...args),
	}),
}));

const kudosId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

function createRequest(method: string) {
	return new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/like`, {
		method,
	});
}

function createContext() {
	return { params: Promise.resolve({ id: kudosId }) };
}

function mockKudosFound(senderId = "user-sender", heartCount = 10) {
	return {
		select: vi.fn().mockReturnValue({
			eq: vi.fn().mockReturnValue({
				single: vi.fn().mockResolvedValue({
					data: { id: kudosId, sender_id: senderId, heart_count: heartCount },
					error: null,
				}),
			}),
		}),
	};
}

function mockKudosNotFound() {
	return {
		select: vi.fn().mockReturnValue({
			eq: vi.fn().mockReturnValue({
				single: vi
					.fn()
					.mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
			}),
		}),
	};
}

function mockSpecialDaysNone() {
	return {
		select: vi.fn().mockReturnValue({
			eq: vi.fn().mockReturnValue({
				single: vi
					.fn()
					.mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
			}),
		}),
	};
}

function mockSpecialDaysActive(multiplier = 2) {
	return {
		select: vi.fn().mockReturnValue({
			eq: vi.fn().mockReturnValue({
				single: vi
					.fn()
					.mockResolvedValue({ data: { multiplier }, error: null }),
			}),
		}),
	};
}

function mockHeartsForDelete(isSpecialDay = false) {
	return {
		select: vi.fn().mockReturnValue({
			eq: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({
						data: { id: "heart-1", is_special_day: isSpecialDay, kudos_id: kudosId },
						error: null,
					}),
				}),
			}),
		}),
		delete: vi.fn().mockReturnValue({
			eq: vi.fn().mockResolvedValue({ error: null }),
		}),
	};
}

describe("POST /api/kudos/[id]/like", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-liker" } },
		});
		mockRpc.mockResolvedValue({ error: null });
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const response = await POST(createRequest("POST"), createContext());
		expect(response.status).toBe(401);
	});

	it("returns 404 when kudos not found", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") return mockKudosNotFound();
			return {};
		});

		const response = await POST(createRequest("POST"), createContext());
		expect(response.status).toBe(404);
	});

	it("returns 403 when sender tries to like own kudos", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-sender" } },
		});
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") return mockKudosFound("user-sender");
			return {};
		});

		const response = await POST(createRequest("POST"), createContext());
		expect(response.status).toBe(403);
	});

	it("returns 201 on successful like with correct response shape", async () => {
		// heart_count: 11 simulates the post-increment value returned by the DB after RPC
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") return mockKudosFound("user-sender", 11);
			if (table === "special_days") return mockSpecialDaysNone();
			if (table === "kudos_hearts") {
				return { insert: vi.fn().mockResolvedValue({ error: null }) };
			}
			return {};
		});

		const response = await POST(createRequest("POST"), createContext());
		expect(response.status).toBe(201);

		const body = await response.json();
		expect(body.kudo_id).toBe(kudosId);
		expect(body.heart_count).toBe(11);
		expect(body.tim_awarded).toBe(1);
		expect(body).not.toHaveProperty("liked");
		expect(body).not.toHaveProperty("is_special_day");
	});

	it("returns 409 on duplicate like (unique constraint)", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") return mockKudosFound();
			if (table === "special_days") return mockSpecialDaysNone();
			if (table === "kudos_hearts") {
				return { insert: vi.fn().mockResolvedValue({ error: { code: "23505" } }) };
			}
			return {};
		});

		const response = await POST(createRequest("POST"), createContext());
		expect(response.status).toBe(409);
	});

	it("awards 2 tim on special day and includes in response", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos") return mockKudosFound("user-sender", 10);
			if (table === "special_days") return mockSpecialDaysActive(2);
			if (table === "kudos_hearts") {
				return { insert: vi.fn().mockResolvedValue({ error: null }) };
			}
			return {};
		});

		const response = await POST(createRequest("POST"), createContext());
		const body = await response.json();
		expect(body.tim_awarded).toBe(2);
		expect(body.kudo_id).toBe(kudosId);
		expect(body.heart_count).toBeDefined();
	});
});

describe("DELETE /api/kudos/[id]/like", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({
			data: { user: { id: "user-liker" } },
		});
		mockRpc.mockResolvedValue({ error: null });
	});

	it("returns 401 when not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });

		const response = await DELETE(createRequest("DELETE"), createContext());
		expect(response.status).toBe(401);
	});

	it("returns 404 when heart not found", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos_hearts") {
				return {
					select: vi.fn().mockReturnValue({
						eq: vi.fn().mockReturnValue({
							eq: vi.fn().mockReturnValue({
								single: vi
									.fn()
									.mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
							}),
						}),
					}),
				};
			}
			return {};
		});

		const response = await DELETE(createRequest("DELETE"), createContext());
		expect(response.status).toBe(404);
	});

	it("returns 200 on successful unlike with correct response shape", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos_hearts") return mockHeartsForDelete(false);
			if (table === "kudos") return mockKudosFound("user-sender", 5);
			return {};
		});

		const response = await DELETE(createRequest("DELETE"), createContext());
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.kudo_id).toBe(kudosId);
		expect(body.heart_count).toBe(4); // decremented after RPC
		expect(body.tim_revoked).toBe(1);
		expect(body).not.toHaveProperty("liked");
	});

	it("revokes 2 tim when heart was placed on special day", async () => {
		mockFrom.mockImplementation((table: string) => {
			if (table === "kudos_hearts") return mockHeartsForDelete(true);
			if (table === "kudos") return mockKudosFound("user-sender", 5);
			return {};
		});

		const response = await DELETE(createRequest("DELETE"), createContext());
		const body = await response.json();
		expect(body.kudo_id).toBe(kudosId);
		expect(body.tim_revoked).toBe(2);
		expect(body.heart_count).toBeDefined();
	});
});
