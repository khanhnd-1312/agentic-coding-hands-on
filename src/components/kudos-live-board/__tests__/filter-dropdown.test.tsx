import { render, screen, fireEvent } from "@testing-library/react";
import { FilterDropdown } from "../filter-dropdown";

const mockOptions = [
	{ id: "h1", name: "#Dedicated" },
	{ id: "h2", name: "#Inspiring" },
	{ id: "h3", name: "#TeamPlayer" },
];

describe("FilterDropdown", () => {
	it("renders trigger button with label", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("Hashtag")).toBeInTheDocument();
	});

	it("opens dropdown on click with aria-expanded=true", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		const trigger = screen.getByRole("button", { name: /Hashtag/i });
		expect(trigger).toHaveAttribute("aria-expanded", "false");

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute("aria-expanded", "true");
	});

	it("renders listbox with options when open", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Hashtag/i }));

		expect(screen.getByRole("listbox")).toBeInTheDocument();
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);
		expect(options[0]).toHaveTextContent("#Dedicated");
	});

	it("calls onSelect with option id when an option is clicked", () => {
		const onSelect = vi.fn();
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={onSelect}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Hashtag/i }));
		fireEvent.click(screen.getByText("#Inspiring"));

		expect(onSelect).toHaveBeenCalledWith("h2");
	});

	it("clears selection when clicking the already-selected option", () => {
		const onSelect = vi.fn();
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected="h1"
				onSelect={onSelect}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Hashtag/i }));
		fireEvent.click(screen.getByText("#Dedicated"));

		expect(onSelect).toHaveBeenCalledWith(null);
	});

	it("marks the selected option with aria-selected=true", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected="h2"
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Hashtag/i }));

		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveAttribute("aria-selected", "false");
		expect(options[1]).toHaveAttribute("aria-selected", "true");
	});

	it("supports keyboard navigation with ArrowDown/ArrowUp/Enter", () => {
		const onSelect = vi.fn();
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={onSelect}
			/>,
		);
		// Open dropdown
		const trigger = screen.getByRole("button", { name: /Hashtag/i });
		fireEvent.click(trigger);

		const listbox = screen.getByRole("listbox");
		// ArrowDown focuses next
		fireEvent.keyDown(listbox, { key: "ArrowDown" });
		fireEvent.keyDown(listbox, { key: "ArrowDown" });
		// Enter selects
		fireEvent.keyDown(listbox, { key: "Enter" });

		expect(onSelect).toHaveBeenCalledWith("h2");
	});

	it("closes on Escape key", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Hashtag/i }));
		expect(screen.getByRole("listbox")).toBeInTheDocument();

		fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("shows selected value in trigger when an option is selected", () => {
		render(
			<FilterDropdown
				label="Hashtag"
				options={mockOptions}
				selected="h1"
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("#Dedicated")).toBeInTheDocument();
	});
});
