import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrelaunchTimer } from "./prelaunch-timer";

describe("PrelaunchTimer", () => {
	const defaultProps = {
		days: "05",
		hours: "12",
		minutes: "30",
	};

	it("renders 3 time units with labels DAYS, HOURS, MINUTES", () => {
		render(<PrelaunchTimer {...defaultProps} />);

		expect(screen.getByText("DAYS")).toBeInTheDocument();
		expect(screen.getByText("HOURS")).toBeInTheDocument();
		expect(screen.getByText("MINUTES")).toBeInTheDocument();
	});

	it("renders correct digit values split into individual cards", () => {
		render(<PrelaunchTimer {...defaultProps} />);

		// Days: "0" and "5"
		const allDigits = screen.getAllByTestId("digit-card");
		expect(allDigits).toHaveLength(6); // 2 per unit × 3 units

		// Check digit content: 0, 5, 1, 2, 3, 0
		const digitTexts = allDigits.map((el) => el.textContent);
		expect(digitTexts).toEqual(["0", "5", "1", "2", "3", "0"]);
	});

	it("has role=timer and aria-live=polite with aria-atomic=true", () => {
		render(<PrelaunchTimer {...defaultProps} />);

		const timer = screen.getByRole("timer");
		expect(timer).toHaveAttribute("aria-live", "polite");
		expect(timer).toHaveAttribute("aria-atomic", "true");
	});

	it("includes sr-only countdown text for screen readers", () => {
		render(<PrelaunchTimer {...defaultProps} />);

		const srText = screen.getByText(/Countdown:/);
		expect(srText).toHaveClass("sr-only");
		expect(srText.textContent).toContain("5 days");
		expect(srText.textContent).toContain("12 hours");
		expect(srText.textContent).toContain("30 minutes");
	});

	it("renders 00:00:00 when all values are zero", () => {
		render(<PrelaunchTimer days="00" hours="00" minutes="00" />);

		const allDigits = screen.getAllByTestId("digit-card");
		const digitTexts = allDigits.map((el) => el.textContent);
		expect(digitTexts).toEqual(["0", "0", "0", "0", "0", "0"]);
	});

	it("caps days at 99 when value exceeds 2 digits", () => {
		render(<PrelaunchTimer days="120" hours="05" minutes="10" />);

		const allDigits = screen.getAllByTestId("digit-card");
		const digitTexts = allDigits.map((el) => el.textContent);
		// Days capped at 99, hours and minutes unchanged
		expect(digitTexts).toEqual(["9", "9", "0", "5", "1", "0"]);
	});
});
