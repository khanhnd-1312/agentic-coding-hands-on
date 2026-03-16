import { render, screen, fireEvent } from "@testing-library/react";
import { KudosSearchInput } from "../kudos-search-input";

describe("KudosSearchInput", () => {
	it("renders pill-shaped input with placeholder", () => {
		render(
			<KudosSearchInput
				placeholder="Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?"
				onClick={vi.fn()}
			/>,
		);
		expect(
			screen.getByPlaceholderText(
				"Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
			),
		).toBeInTheDocument();
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		render(
			<KudosSearchInput
				placeholder="placeholder"
				onClick={onClick}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders pen icon", () => {
		const { container } = render(
			<KudosSearchInput placeholder="test" onClick={vi.fn()} />,
		);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("has read-only input (trigger only)", () => {
		render(
			<KudosSearchInput placeholder="test" onClick={vi.fn()} />,
		);
		expect(screen.getByPlaceholderText("test")).toHaveAttribute("readOnly");
	});
});
