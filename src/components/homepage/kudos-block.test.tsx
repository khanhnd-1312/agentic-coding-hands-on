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

import { KudosBlock } from "./kudos-block";

describe("KudosBlock", () => {
	it("renders caption 'Phong trào ghi nhận'", () => {
		render(<KudosBlock />);
		expect(screen.getByText("Phong trào ghi nhận")).toBeInTheDocument();
	});

	it("renders title 'Sun* Kudos' in accent color", () => {
		render(<KudosBlock />);
		const title = screen.getByText("Sun* Kudos");
		expect(title).toBeInTheDocument();
		expect(title.className).toMatch(/FFEA9E|text-\[#FFEA9E\]/);
	});

	it("'Chi tiết' CTA link navigates to /kudo/live", () => {
		render(<KudosBlock />);
		const link = screen.getByRole("link", { name: /chi tiết/i });
		expect(link).toHaveAttribute("href", "/kudo/live");
	});

	it("container has dark background class", () => {
		const { container } = render(<KudosBlock />);
		const card = container.firstChild as HTMLElement;
		expect(card.className).toMatch(/0F0F0F|bg-\[#0F0F0F\]|kudos-bg/);
	});
});
