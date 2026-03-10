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

vi.mock("../../hooks/use-countdown", () => ({
	useCountdown: vi.fn(() => ({
		days: "10",
		hours: "05",
		minutes: "30",
		isEventStarted: false,
	})),
	DEFAULT_EVENT_DATE: "2025-11-15T18:30:00+07:00",
	calcTimeLeft: vi.fn(),
}));

import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
	it("renders keyvisual <img> element", () => {
		render(<HeroSection />);
		const keyvisual = screen.getByAltText("SAA 2025 keyvisual");
		expect(keyvisual).toBeInTheDocument();
	});

	it("renders Root Further logo with priority", () => {
		render(<HeroSection />);
		const logo = screen.getByAltText("Root Further — Sun Annual Awards 2025");
		expect(logo).toBeInTheDocument();
	});

	it("renders gradient cover div", () => {
		const { container } = render(<HeroSection />);
		const gradient = container.querySelector("[data-testid='gradient-cover']");
		expect(gradient).toBeInTheDocument();
	});

	it("renders Countdown component", () => {
		render(<HeroSection />);
		// Countdown renders "Coming soon" text
		expect(screen.getByText("Coming soon")).toBeInTheDocument();
	});

	it("renders EventInfo with time label", () => {
		render(<HeroSection />);
		expect(screen.getByText("Thời gian:")).toBeInTheDocument();
	});

	it("renders CTAButtons with awards link", () => {
		render(<HeroSection />);
		expect(
			screen.getByRole("link", { name: /about awards/i })
		).toBeInTheDocument();
	});

	it("renders ContentBlock with Root Further text", () => {
		render(<HeroSection />);
		expect(screen.getAllByText(/Root Further/i)[0]).toBeInTheDocument();
	});
});
