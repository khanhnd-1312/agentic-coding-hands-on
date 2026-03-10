import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { AwardCategory } from "@/types/homepage";

vi.mock("next/image", () => ({
	default: ({
		alt,
		...props
	}: {
		alt: string;
		[key: string]: unknown;
	}) => <img alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />,
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

import { AwardsSection } from "./awards-section";

const mockAwards: AwardCategory[] = [
	{
		id: "1",
		slug: "top-talent",
		name: "Top Talent",
		description: "Desc 1",
		thumbnailUrl: "https://example.com/1.png",
	},
	{
		id: "2",
		slug: "top-project",
		name: "Top Project",
		description: "Desc 2",
		thumbnailUrl: "https://example.com/2.png",
	},
	{
		id: "3",
		slug: "top-project-leader",
		name: "Top Project Leader",
		description: "Desc 3",
		thumbnailUrl: "https://example.com/3.png",
	},
	{
		id: "4",
		slug: "best-manager",
		name: "Best Manager",
		description: "Desc 4",
		thumbnailUrl: "https://example.com/4.png",
	},
	{
		id: "5",
		slug: "signature-creator",
		name: "Signature Creator",
		description: "Desc 5",
		thumbnailUrl: "https://example.com/5.png",
	},
	{
		id: "6",
		slug: "mvp",
		name: "MVP",
		description: "Desc 6",
		thumbnailUrl: "https://example.com/6.png",
	},
];

describe("AwardsSection", () => {
	it("renders section header caption", () => {
		render(<AwardsSection awards={mockAwards} />);
		expect(
			screen.getByText("Sun* annual awards 2025")
		).toBeInTheDocument();
	});

	it("renders 'Hệ thống giải thưởng' title in accent color", () => {
		render(<AwardsSection awards={mockAwards} />);
		const title = screen.getByText("Hệ thống giải thưởng");
		expect(title).toBeInTheDocument();
		expect(title.className).toMatch(/FFEA9E|text-\[#FFEA9E\]/);
	});

	it("renders 6 AwardCard components", () => {
		render(<AwardsSection awards={mockAwards} />);
		const details = screen.getAllByRole("link", { name: /chi tiết/i });
		expect(details).toHaveLength(6);
	});

	it("shows empty state message when awards array is empty", () => {
		render(<AwardsSection awards={[]} />);
		expect(
			screen.getByText("Dữ liệu đang được cập nhật")
		).toBeInTheDocument();
	});

	it("shows error banner when error prop is true", () => {
		render(<AwardsSection awards={[]} error />);
		expect(
			screen.getByText(/Không thể tải dữ liệu giải thưởng/i)
		).toBeInTheDocument();
	});

	it("retry button is present in error state", () => {
		render(<AwardsSection awards={[]} error />);
		expect(screen.getByRole("button", { name: /thử lại/i })).toBeInTheDocument();
	});
});
