import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/image", () => ({
	default: ({
		alt,
		src,
		...props
	}: {
		alt: string;
		src: string;
		[key: string]: unknown;
	}) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={alt} src={typeof src === "string" ? src : ""} {...props} />
	),
}));

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

import { AwardCard } from "./award-card";
import type { AwardCategory } from "@/types/homepage";

const mockAward: AwardCategory = {
	id: "1",
	slug: "top-talent",
	name: "Top Talent",
	description: "Giải thưởng dành cho tài năng xuất sắc nhất trong năm",
	thumbnailUrl: "https://example.com/top-talent.png",
};

describe("AwardCard", () => {
	it("renders award title in accent color class", () => {
		render(<AwardCard award={mockAward} />);
		const title = screen.getByText("Top Talent");
		expect(title).toBeInTheDocument();
		expect(title.className).toMatch(/FFEA9E|text-\[#FFEA9E\]/);
	});

	it("renders description with line-clamp-2 class", () => {
		render(<AwardCard award={mockAward} />);
		const desc = screen.getByText(mockAward.description);
		expect(desc).toBeInTheDocument();
		expect(desc.className).toMatch(/line-clamp-2/);
	});

	it("'Chi tiết' link href is /awards-information#top-talent", () => {
		render(<AwardCard award={mockAward} />);
		const link = screen.getByRole("link", { name: /chi tiết/i });
		expect(link).toHaveAttribute("href", "/awards-information#top-talent");
	});

	it("award image has mix-blend-screen class", () => {
		render(<AwardCard award={mockAward} />);
		const img = screen.getByAltText("Top Talent");
		expect(img.parentElement?.className ?? img.className).toMatch(
			/mix-blend-screen/
		);
	});

	it("renders award image with correct alt text", () => {
		render(<AwardCard award={mockAward} />);
		expect(screen.getByAltText("Top Talent")).toBeInTheDocument();
	});
});
