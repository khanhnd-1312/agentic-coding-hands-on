import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AwardInfoCard } from "./award-info-card";
import type { AwardCategory } from "@/types/homepage";

const mockAward: AwardCategory = {
	id: "award-top-talent",
	slug: "top-talent",
	name: "Top Talent",
	description: "Vinh danh những cá nhân xuất sắc nhất trong năm.",
	thumbnailUrl: "/images/homepage/award-top-talent.png",
	quantity: 10,
	unit: "Đơn vị",
	prize: "7.000.000 VNĐ/giải",
	detailImageUrl: "/images/awards/top-talent.png",
};

describe("AwardInfoCard", () => {
	it("renders section with correct id", () => {
		const { container } = render(<AwardInfoCard award={mockAward} />);
		const section = container.querySelector("section#top-talent");
		expect(section).toBeInTheDocument();
	});

	it("renders h2 with award name", () => {
		render(<AwardInfoCard award={mockAward} />);
		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toHaveTextContent("Top Talent");
	});

	it("renders quantity and unit text", () => {
		render(<AwardInfoCard award={mockAward} />);
		expect(screen.getByText("10")).toBeInTheDocument();
		// translateAward overrides unit with dictionary value for top-talent slug
		expect(screen.getByText("Cá nhân")).toBeInTheDocument();
	});

	it("renders prize value text", () => {
		render(<AwardInfoCard award={mockAward} />);
		expect(screen.getByText("7.000.000 VNĐ/giải")).toBeInTheDocument();
	});

	it("renders image with correct alt text", () => {
		render(<AwardInfoCard award={mockAward} />);
		const img = screen.getByAltText("Hình ảnh giải thưởng Top Talent");
		expect(img).toBeInTheDocument();
	});

	// Phase 5: Data accuracy tests (US3 + US4)
	it("D.1 Top Talent: displays 10 Cá nhân / 7.000.000 VNĐ", () => {
		render(<AwardInfoCard award={mockAward} />);
		expect(screen.getByText("10")).toBeInTheDocument();
		expect(screen.getByText("Cá nhân")).toBeInTheDocument();
		expect(screen.getByText("7.000.000 VNĐ/giải")).toBeInTheDocument();
	});

	it("D.2 Top Project: displays 02 Tập thể / 15.000.000 VNĐ", () => {
		render(
			<AwardInfoCard
				award={{
					...mockAward,
					id: "award-top-project",
					slug: "top-project",
					name: "Top Project",
					quantity: 2,
					unit: "Tập thể",
					prize: "15.000.000 VNĐ/giải",
				}}
			/>
		);
		expect(screen.getByText("02")).toBeInTheDocument();
		expect(screen.getByText("Tập thể")).toBeInTheDocument();
		expect(screen.getByText("15.000.000 VNĐ/giải")).toBeInTheDocument();
	});

	it("D.3 Top Project Leader: displays 03 Cá nhân / 7.000.000 VNĐ", () => {
		render(
			<AwardInfoCard
				award={{
					...mockAward,
					id: "award-top-project-leader",
					slug: "top-project-leader",
					name: "Top Project Leader",
					quantity: 3,
					unit: "Cá nhân",
					prize: "7.000.000 VNĐ/giải",
				}}
			/>
		);
		expect(screen.getByText("03")).toBeInTheDocument();
		expect(screen.getByText("Cá nhân")).toBeInTheDocument();
	});

	it("D.4 Best Manager: displays 01 Cá nhân / 10.000.000 VNĐ", () => {
		render(
			<AwardInfoCard
				award={{
					...mockAward,
					id: "award-best-manager",
					slug: "best-manager",
					name: "Best Manager",
					quantity: 1,
					unit: "Cá nhân",
					prize: "10.000.000 VNĐ/giải",
				}}
			/>
		);
		expect(screen.getByText("01")).toBeInTheDocument();
		expect(screen.getByText("10.000.000 VNĐ/giải")).toBeInTheDocument();
	});

	it("D.5 Signature 2025: displays dual prize 5.000.000 / 8.000.000 VNĐ", () => {
		render(
			<AwardInfoCard
				award={{
					...mockAward,
					id: "award-signature-creator",
					slug: "signature-creator",
					name: "Signature Creator",
					quantity: 1,
					unit: "Cá nhân / Tập thể",
					prize: "5.000.000 / 8.000.000 VNĐ",
				}}
			/>
		);
		// translateAward overrides unit with dictionary value for signature-creator slug
		expect(screen.getByText("Cá nhân hoặc tập thể")).toBeInTheDocument();
		expect(
			screen.getByText("5.000.000 / 8.000.000 VNĐ")
		).toBeInTheDocument();
	});

	it("D.6 MVP: displays 01 with empty unit gracefully", () => {
		render(
			<AwardInfoCard
				award={{
					...mockAward,
					id: "award-mvp",
					slug: "mvp",
					name: "MVP",
					quantity: 1,
					unit: "",
					prize: "15.000.000 VNĐ/giải",
				}}
			/>
		);
		expect(screen.getByText("01")).toBeInTheDocument();
		expect(screen.getByText("15.000.000 VNĐ/giải")).toBeInTheDocument();
	});

	it("applies lg:flex-row-reverse when reverse=true", () => {
		const { container } = render(
			<AwardInfoCard award={mockAward} reverse />
		);
		const innerRow = container.querySelector("section > div");
		expect(innerRow?.className).toContain("lg:flex-row-reverse");
	});

	it("does not apply lg:flex-row-reverse by default", () => {
		const { container } = render(<AwardInfoCard award={mockAward} />);
		const innerRow = container.querySelector("section > div");
		expect(innerRow?.className).not.toContain("lg:flex-row-reverse");
	});

	it("award image container has overflow-hidden", () => {
		const { container } = render(<AwardInfoCard award={mockAward} />);
		const imgContainer = container.querySelector(".overflow-hidden");
		expect(imgContainer).toBeInTheDocument();
	});
});
