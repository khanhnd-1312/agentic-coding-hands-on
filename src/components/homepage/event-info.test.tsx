import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EventInfo } from "./event-info";

describe("EventInfo", () => {
	it("renders 'Thời gian:' label in VI (default)", () => {
		render(<EventInfo />);
		expect(screen.getByText("Thời gian:")).toBeInTheDocument();
	});

	it("renders 'Địa điểm:' label in VI (default)", () => {
		render(<EventInfo />);
		expect(screen.getByText("Địa điểm:")).toBeInTheDocument();
	});

	it("renders event date value '26/12/2025' in accent color", () => {
		render(<EventInfo />);
		const dateValue = screen.getByText("26/12/2025");
		expect(dateValue).toBeInTheDocument();
		expect(dateValue.className).toMatch(/FFEA9E|text-\[#FFEA9E\]|color-accent/);
	});

	it("renders venue value text", () => {
		render(<EventInfo />);
		expect(screen.getByText("Âu Cơ Art Center")).toBeInTheDocument();
	});

	it("Facebook group note is a <p> element, not an <a>", () => {
		render(<EventInfo />);
		const note = screen.getByTestId("facebook-note");
		expect(note.tagName).toBe("P");
		expect(note.tagName).not.toBe("A");
	});

	it("renders EN labels when lang='en'", () => {
		render(<EventInfo lang="en" />);
		expect(screen.getByText("Date:")).toBeInTheDocument();
		expect(screen.getByText("Venue:")).toBeInTheDocument();
	});

	it("renders EN venue value when lang='en'", () => {
		render(<EventInfo lang="en" />);
		expect(screen.getByText("Âu Cơ Art Center")).toBeInTheDocument();
	});
});
