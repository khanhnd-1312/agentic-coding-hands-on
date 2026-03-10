import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WidgetButton } from "./widget-button";

describe("WidgetButton", () => {
	it("renders a button with aria-label 'Hành động nhanh'", () => {
		render(<WidgetButton />);
		const btn = screen.getByRole("button", { name: "Hành động nhanh" });
		expect(btn).toBeInTheDocument();
	});

	it("has fixed positioning class", () => {
		render(<WidgetButton />);
		const btn = screen.getByRole("button", { name: "Hành động nhanh" });
		expect(btn.className).toMatch(/fixed/);
	});

	it("has yellow background class", () => {
		render(<WidgetButton />);
		const btn = screen.getByRole("button", { name: "Hành động nhanh" });
		expect(btn.className).toMatch(/FFEA9E|bg-\[#FFEA9E\]/);
	});

	it("has rounded-full class (pill shape)", () => {
		render(<WidgetButton />);
		const btn = screen.getByRole("button", { name: "Hành động nhanh" });
		expect(btn.className).toMatch(/rounded-full/);
	});

	it("has z-50 class (above header)", () => {
		render(<WidgetButton />);
		const btn = screen.getByRole("button", { name: "Hành động nhanh" });
		expect(btn.className).toMatch(/z-50/);
	});
});
