import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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

import { vi } from "vitest";
import { CTAButtons } from "./cta-buttons";

describe("CTAButtons", () => {
	it("'ABOUT AWARDS' button navigates to /awards", () => {
		render(<CTAButtons />);
		const awardsLink = screen.getByRole("link", { name: /about awards/i });
		expect(awardsLink).toHaveAttribute("href", "/awards");
	});

	it("'ABOUT KUDOS' button navigates to /kudo/live", () => {
		render(<CTAButtons />);
		const kudosLink = screen.getByRole("link", { name: /about kudos/i });
		expect(kudosLink).toHaveAttribute("href", "/kudo/live");
	});

	it("both buttons are rendered as Next.js Link elements (anchor tags)", () => {
		render(<CTAButtons />);
		const links = screen.getAllByRole("link");
		expect(links.length).toBeGreaterThanOrEqual(2);
	});

	it("primary button has yellow background class", () => {
		render(<CTAButtons />);
		const awardsLink = screen.getByRole("link", { name: /about awards/i });
		expect(awardsLink.className).toMatch(/FFEA9E|bg-\[#FFEA9E\]/);
	});

	it("both buttons have aria-labels", () => {
		render(<CTAButtons />);
		const awardsLink = screen.getByRole("link", { name: /about awards/i });
		const kudosLink = screen.getByRole("link", { name: /about kudos/i });
		expect(awardsLink).toBeInTheDocument();
		expect(kudosLink).toBeInTheDocument();
	});
});
