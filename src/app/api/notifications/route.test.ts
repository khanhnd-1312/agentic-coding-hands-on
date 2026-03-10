import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { NotificationCountSchema } from "@/types/homepage";

describe("GET /api/notifications", () => {
	it("returns 200 status", async () => {
		const response = await GET();
		expect(response.status).toBe(200);
	});

	it("returns JSON matching NotificationCountSchema", async () => {
		const response = await GET();
		const body = await response.json();
		const parsed = NotificationCountSchema.safeParse(body);
		expect(parsed.success).toBe(true);
	});

	it("returns count of 0 (stub)", async () => {
		const response = await GET();
		const body = await response.json() as { count: number };
		expect(body.count).toBe(0);
	});
});
