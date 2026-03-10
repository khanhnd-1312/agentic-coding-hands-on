import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { AwardCategorySchema, AWARD_SLUGS } from "@/types/homepage";
import { z } from "zod";

describe("GET /api/awards", () => {
	it("returns 200 status", async () => {
		const response = await GET();
		expect(response.status).toBe(200);
	});

	it("returns an array of 6 award categories", async () => {
		const response = await GET();
		const body = await response.json();
		expect(Array.isArray(body)).toBe(true);
		expect(body).toHaveLength(6);
	});

	it("each item matches AwardCategorySchema", async () => {
		const response = await GET();
		const body = await response.json();
		const parsed = z.array(AwardCategorySchema).safeParse(body);
		expect(parsed.success).toBe(true);
	});

	it("contains all required slugs", async () => {
		const response = await GET();
		const body = await response.json() as Array<{ slug: string }>;
		const slugs = body.map((a) => a.slug);
		for (const requiredSlug of AWARD_SLUGS) {
			expect(slugs).toContain(requiredSlug);
		}
	});

	it("each item has id, name, description, thumbnailUrl", async () => {
		const response = await GET();
		const body = await response.json() as Array<Record<string, unknown>>;
		for (const award of body) {
			expect(award.id).toBeTruthy();
			expect(award.name).toBeTruthy();
			expect(award.description).toBeTruthy();
			expect(award.thumbnailUrl).toBeTruthy();
		}
	});
});
