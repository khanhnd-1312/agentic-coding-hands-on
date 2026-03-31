import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/"),
	useRouter: vi.fn(() => ({ push: vi.fn() })),
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

vi.mock("@/libs/supabase/client", () => ({
	createClient: () => ({ auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } }),
}));

vi.mock("../login/language-selector", () => ({
	LanguageSelector: ({ lang, isOpen, onToggle }: { lang: string; isOpen?: boolean; onToggle?: (open: boolean) => void }) => (
		<div data-testid="language-selector" data-lang={lang}>
			<button
				data-testid="lang-trigger"
				aria-expanded={isOpen ?? false}
				onClick={() => onToggle?.(!isOpen)}
			>
				{lang}
			</button>
			{isOpen && <div data-testid="lang-dropdown">Language Dropdown</div>}
		</div>
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

	it("avatar/profile trigger button renders with aria-label", () => {
		render(<Header />);
		const avatar = screen.getByRole("button", { name: "User menu" });
		expect(avatar).toBeInTheDocument();
	});

	// --- Mutual exclusivity: only one dropdown open at a time ---

	it("language dropdown opens when lang trigger clicked", () => {
		render(<Header />);
		const langTrigger = screen.getByTestId("lang-trigger");
		fireEvent.click(langTrigger);
		expect(screen.getByTestId("lang-dropdown")).toBeInTheDocument();
	});

	it("opening avatar dropdown closes language dropdown", () => {
		render(<Header />);
		// Open language dropdown
		const langTrigger = screen.getByTestId("lang-trigger");
		fireEvent.click(langTrigger);
		expect(screen.getByTestId("lang-dropdown")).toBeInTheDocument();

		// Click avatar — should close language dropdown
		const avatar = screen.getByRole("button", { name: "User menu" });
		fireEvent.click(avatar);
		expect(screen.queryByTestId("lang-dropdown")).not.toBeInTheDocument();
	});
});
