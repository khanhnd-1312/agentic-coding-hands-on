import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/"),
}));

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

vi.mock("../login/language-selector", () => ({
	LanguageSelector: ({ lang }: { lang: string }) => (
		<div data-testid="language-selector" data-lang={lang} />
	),
}));

import { HomePage } from "./homepage";
import type { AwardCategory } from "@/types/homepage";

const mockAwards: AwardCategory[] = [
	{
		id: "1",
		slug: "top-talent",
		name: "Top Talent",
		description: "desc",
		thumbnailUrl: "/award.png",
	},
];

describe("HomePage", () => {
	it("renders skip nav link as first focusable element", () => {
		render(<HomePage awards={mockAwards} />);
		const skipNav = screen.getByRole("link", { name: /skip to main content/i });
		expect(skipNav).toBeInTheDocument();
		expect(skipNav).toHaveAttribute("href", "#main-content");
	});

	it("renders header landmark", () => {
		render(<HomePage awards={mockAwards} />);
		expect(screen.getByRole("banner")).toBeInTheDocument();
	});

	it("renders main landmark with id='main-content'", () => {
		render(<HomePage awards={mockAwards} />);
		const main = screen.getByRole("main");
		expect(main).toHaveAttribute("id", "main-content");
	});

	it("renders footer landmark", () => {
		render(<HomePage awards={mockAwards} />);
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("renders 'Hệ thống giải thưởng' section heading", () => {
		render(<HomePage awards={mockAwards} />);
		expect(screen.getByText("Hệ thống giải thưởng")).toBeInTheDocument();
	});

	it("renders Kudos block caption", () => {
		render(<HomePage awards={mockAwards} />);
		expect(screen.getByText("Phong trào ghi nhận")).toBeInTheDocument();
	});

	it("renders widget button", () => {
		render(<HomePage awards={mockAwards} />);
		expect(
			screen.getByRole("button", { name: /hành động nhanh/i }),
		).toBeInTheDocument();
	});
});
