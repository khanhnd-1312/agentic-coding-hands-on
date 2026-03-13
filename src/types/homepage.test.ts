import { describe, it, expect } from "vitest";
import { AwardCategorySchema } from "./homepage";

describe("AwardCategorySchema extended fields", () => {
	const baseAward = {
		id: "award-top-talent",
		slug: "top-talent" as const,
		name: "Top Talent",
		description: "Some description",
		thumbnailUrl: "/images/homepage/award-top-talent.png",
	};

	it("parses successfully with optional quantity field", () => {
		const result = AwardCategorySchema.safeParse({
			...baseAward,
			quantity: 10,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.quantity).toBe(10);
		}
	});

	it("parses successfully with optional unit field", () => {
		const result = AwardCategorySchema.safeParse({
			...baseAward,
			unit: "Đơn vị",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.unit).toBe("Đơn vị");
		}
	});

	it("parses successfully with optional prize field", () => {
		const result = AwardCategorySchema.safeParse({
			...baseAward,
			prize: "7.000.000 VNĐ/giải",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.prize).toBe("7.000.000 VNĐ/giải");
		}
	});

	it("parses successfully with optional detailImageUrl field", () => {
		const result = AwardCategorySchema.safeParse({
			...baseAward,
			detailImageUrl: "/images/awards/top-talent.png",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.detailImageUrl).toBe(
				"/images/awards/top-talent.png"
			);
		}
	});

	it("parses successfully without optional fields", () => {
		const result = AwardCategorySchema.safeParse(baseAward);
		expect(result.success).toBe(true);
	});
});
