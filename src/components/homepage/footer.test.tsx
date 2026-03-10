import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

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

import { Footer } from "./footer";

describe("Footer", () => {
	it("renders copyright text with Montserrat Alternates font class", () => {
		render(<Footer />);
		const copyright = screen.getByText(/Bản quyền thuộc về Sun\* © 2025/i);
		expect(copyright).toBeInTheDocument();
		expect(copyright.className).toMatch(/montserrat-alt|font-\[var\(--font-montserrat-alt\)\]|montserrat_alternates/i);
	});

	it("renders 'About SAA 2025' link with href='/'", () => {
		render(<Footer />);
		const link = screen.getByRole("link", { name: /about saa 2025/i });
		expect(link).toHaveAttribute("href", "/");
	});

	it("renders 'Awards Information' link with href='/awards-information'", () => {
		render(<Footer />);
		const link = screen.getByRole("link", { name: /awards information/i });
		expect(link).toHaveAttribute("href", "/awards-information");
	});

	it("renders 'Sun* Kudos' link with href='/kudo/live'", () => {
		render(<Footer />);
		const link = screen.getByRole("link", { name: /sun\* kudos/i });
		expect(link).toHaveAttribute("href", "/kudo/live");
	});

	it("renders 'Tiêu chuẩn chung' link", () => {
		render(<Footer />);
		const link = screen.getByRole("link", { name: /tiêu chuẩn chung/i });
		expect(link).toBeInTheDocument();
	});

	it("footer has dark border-top class", () => {
		const { container } = render(<Footer />);
		const footer = container.firstChild as HTMLElement;
		expect(footer.className).toMatch(/2E3940|border-\[#2E3940\]/);
	});
});
