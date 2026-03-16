import { render, screen, fireEvent } from "@testing-library/react";
import { CarouselButton } from "../carousel-button";

describe("CarouselButton", () => {
	it("renders with correct aria-label", () => {
		render(
			<CarouselButton direction="next" onClick={vi.fn()} disabled={false} />,
		);
		expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
	});

	it("renders prev button with correct aria-label", () => {
		render(
			<CarouselButton direction="prev" onClick={vi.fn()} disabled={false} />,
		);
		expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
	});

	it("calls onClick when clicked and not disabled", () => {
		const onClick = vi.fn();
		render(
			<CarouselButton direction="next" onClick={onClick} disabled={false} />,
		);
		fireEvent.click(screen.getByLabelText("Next slide"));
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("does not call onClick when disabled", () => {
		const onClick = vi.fn();
		render(
			<CarouselButton direction="next" onClick={onClick} disabled={true} />,
		);
		fireEvent.click(screen.getByLabelText("Next slide"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("has aria-disabled=true when disabled", () => {
		render(
			<CarouselButton direction="next" onClick={vi.fn()} disabled={true} />,
		);
		const button = screen.getByLabelText("Next slide");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("applies disabled styling (opacity and cursor)", () => {
		render(
			<CarouselButton direction="next" onClick={vi.fn()} disabled={true} />,
		);
		const button = screen.getByLabelText("Next slide");
		expect(button.className).toMatch(/opacity/);
		expect(button.className).toMatch(/not-allowed/);
	});
});
