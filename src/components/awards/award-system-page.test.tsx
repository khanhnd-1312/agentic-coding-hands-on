import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AwardSystemPage } from "./award-system-page";
import { AWARDS_SEED } from "@/data/awards";

// Mock next/image to render a simple img
vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => {
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
		return <img {...props} />;
	},
}));

// Mock Header and Footer to avoid complex dependencies
vi.mock("@/components/homepage/header", () => ({
	Header: () => <header data-testid="header" />,
}));

vi.mock("@/components/homepage/footer", () => ({
	Footer: () => <footer data-testid="footer" />,
}));

// Mock the client component AwardNavMenu
vi.mock("./award-nav-menu", () => ({
	AwardNavMenu: () => <nav data-testid="award-nav-menu" />,
}));

describe("AwardSystemPage", () => {
	it("renders 6 award card sections", () => {
		const { container } = render(
			<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />
		);
		const sections = container.querySelectorAll("section[id]");
		expect(sections.length).toBe(6);
	});

	it("renders page title", () => {
		render(<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />);
		const title = screen.getByRole("heading", { level: 1 });
		expect(title).toHaveTextContent("Hệ thống giải thưởng SAA 2025");
	});

	it("renders footer", () => {
		render(<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />);
		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	// Phase 7: Hero banner tests (US6)
	it("renders hero keyvisual image with correct alt text", () => {
		render(<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />);
		const heroImg = screen.getByAltText(
			"Keyvisual Sun* Annual Award 2025"
		);
		expect(heroImg).toBeInTheDocument();
	});

	it("renders decorative images with empty alt", () => {
		render(<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />);
		const decorativeImgs = screen.getAllByAltText("");
		// KV block has alt=""
		expect(decorativeImgs.length).toBeGreaterThanOrEqual(1);
	});

	it("hero section has overflow-hidden class", () => {
		const { container } = render(
			<AwardSystemPage awards={AWARDS_SEED} initialLang="vi" />
		);
		const heroDiv = container.querySelector(".overflow-hidden");
		expect(heroDiv).toBeInTheDocument();
	});
});
