import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SunKudosBlock } from "./sun-kudos-block";

describe("SunKudosBlock", () => {
	it("renders 'Phong trào ghi nhận' label", () => {
		render(<SunKudosBlock />);
		expect(screen.getByText("Phong trào ghi nhận")).toBeInTheDocument();
	});

	it("renders 'Sun* Kudos' title", () => {
		render(<SunKudosBlock />);
		expect(screen.getByText("Sun* Kudos")).toBeInTheDocument();
	});

	it("renders Chi tiết as a link to /kudo/live without target=_blank", () => {
		render(<SunKudosBlock />);
		const link = screen.getByRole("link", { name: /Xem Sun\* Kudos Live board/i });
		expect(link).toHaveAttribute("href", "/kudo/live");
		expect(link).not.toHaveAttribute("target", "_blank");
	});

	it("has aria-label on the Chi tiết button", () => {
		render(<SunKudosBlock />);
		const link = screen.getByRole("link", { name: "Xem Sun* Kudos Live board" });
		expect(link).toBeInTheDocument();
	});

	it("renders ic-arrow icon inside button", () => {
		render(<SunKudosBlock />);
		const link = screen.getByRole("link", { name: "Xem Sun* Kudos Live board" });
		const svg = link.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});
});
