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

import { Header } from "./header";

describe("Header", () => {
	it("renders 'About SAA 2025' nav link with href='/'", () => {
		render(<Header />);
		const link = screen.getByRole("link", { name: /about saa 2025/i });
		expect(link).toHaveAttribute("href", "/");
	});

	it("'About SAA 2025' link has active styles when pathname='/'", () => {
		render(<Header />);
		const link = screen.getByRole("link", { name: /about saa 2025/i });
		expect(link.className).toMatch(/FFEA9E|text-\[#FFEA9E\]/);
	});

	it("'Awards Information' link renders with href='/awards'", () => {
		render(<Header />);
		const link = screen.getByRole("link", { name: /awards information/i });
		expect(link).toHaveAttribute("href", "/awards");
	});

	it("'Sun* Kudos' link renders with href='/kudo/live'", () => {
		render(<Header />);
		const link = screen.getByRole("link", { name: /sun\* kudos/i });
		expect(link).toHaveAttribute("href", "/kudo/live");
	});

	it("notification button has aria-label", () => {
		render(<Header />);
		const btn = screen.getByRole("button", { name: /thông báo/i });
		expect(btn).toBeInTheDocument();
	});

	it("notification badge hidden when count is 0 (default)", () => {
		render(<Header />);
		const badge = screen.queryByTestId("notification-badge");
		expect(badge).not.toBeInTheDocument();
	});

	it("renders LanguageSelector component", () => {
		render(<Header />);
		expect(screen.getByTestId("language-selector")).toBeInTheDocument();
	});

	it("avatar button has aria-label 'Tài khoản'", () => {
		render(<Header />);
		const avatar = screen.getByRole("button", { name: "Tài khoản" });
		expect(avatar).toBeInTheDocument();
	});
});
