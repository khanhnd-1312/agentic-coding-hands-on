import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/font/local used in layout — not needed here but prevents import errors
vi.mock("../../hooks/use-countdown", () => ({
	useCountdown: vi.fn(() => ({
		days: "05",
		hours: "03",
		minutes: "47",
		isEventStarted: false,
	})),
	EVENT_DATETIME: "2026-11-15T18:30:00+07:00",
	calcTimeLeft: vi.fn(),
}));

import { Countdown } from "./countdown";

describe("Countdown", () => {
	it("renders 3 tiles: DAYS, HOURS, MINUTES", () => {
		render(<Countdown />);
		expect(screen.getByText("NGÀY")).toBeInTheDocument();
		expect(screen.getByText("GIỜ")).toBeInTheDocument();
		expect(screen.getByText("PHÚT")).toBeInTheDocument();
	});

	it("renders correct digit values from hook", () => {
		render(<Countdown />);
		// mock returns days="05" hours="03" minutes="47"
		// each digit is rendered in its own DigitBox — use getAllByText for repeated chars
		expect(screen.getAllByText("0").length).toBeGreaterThan(0); // leading zeros
		expect(screen.getByText("5")).toBeInTheDocument(); // days second digit
		expect(screen.getByText("4")).toBeInTheDocument(); // minutes first digit
		expect(screen.getByText("7")).toBeInTheDocument(); // minutes second digit
	});

	it("renders 'Coming soon' label when isEventStarted=false", () => {
		render(<Countdown />);
		expect(screen.getByText("Coming soon")).toBeInTheDocument();
	});

	it("hides 'Coming soon' label when isEventStarted=true", async () => {
		const { useCountdown } = await import("../../hooks/use-countdown");
		vi.mocked(useCountdown).mockReturnValueOnce({
			days: "00",
			hours: "00",
			minutes: "00",
			isEventStarted: true,
		});
		render(<Countdown />);
		expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
	});

	it("root element has aria-live='polite'", () => {
		const { container } = render(<Countdown />);
		const root = container.firstChild as HTMLElement;
		expect(root).toHaveAttribute("aria-live", "polite");
	});

	it("root element has aria-label", () => {
		const { container } = render(<Countdown />);
		const root = container.firstChild as HTMLElement;
		expect(root).toHaveAttribute("aria-label");
	});
});
