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

	// --- T001: Selected item bg opacity 0.1 ---
	it("selected item has bg-[rgba(255,234,158,0.1)] (not 0.2)", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected="h1"
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const selected = screen.getAllByRole("option").find(
			(el) => el.getAttribute("aria-selected") === "true",
		)!;
		expect(selected.className).toContain("bg-[rgba(255,234,158,0.1)]");
		expect(selected.className).not.toContain("bg-[rgba(255,234,158,0.2)]");
	});

	// --- T002: Item text uses text-base (16px) ---
	it("item text uses text-base (16px) not text-sm", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const option = screen.getAllByRole("option")[0];
		expect(option.className).toContain("text-base");
		expect(option.className).not.toContain("text-sm");
	});

	// --- T003: Selected item has text-shadow glow ---
	it("selected item has text-shadow glow class", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected="h2"
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const selected = screen.getAllByRole("option").find(
			(el) => el.getAttribute("aria-selected") === "true",
		)!;
		expect(selected.className).toMatch(/text-shadow/);
	});

	// --- T004: Items have p-4 and h-14 ---
	it("items have p-4 padding and h-14 height", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const option = screen.getAllByRole("option")[0];
		expect(option.className).toContain("p-4");
		expect(option.className).toContain("h-14");
	});

	// --- T005: Dropdown list has max-height and overflow-y-auto ---
	it("dropdown list has max-h-[348px] and overflow-y-auto for scrolling", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("max-h-87");
		expect(listbox.className).toContain("overflow-y-auto");
	});

	// --- T015: Dropdown with 50 items is scrollable ---
	it("dropdown list with 50 items has scroll constraint", () => {
		const manyOptions = Array.from({ length: 50 }, (_, i) => ({
			id: `dept-${i}`,
			name: `Department ${i}`,
		}));
		render(
			<FilterDropdown
				label="Dept"
				options={manyOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("overflow-y-auto");
		expect(screen.getAllByRole("option")).toHaveLength(50);
	});

	// --- T016: Empty options renders fallback ---
	it("renders fallback message when options are empty", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={[]}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		expect(screen.getByText("Không có dữ liệu")).toBeInTheDocument();
	});

	// --- T006: Focus ring uses teal #15D5CA ---
	it("item focus ring uses outline-[#15D5CA] (teal)", () => {
		render(
			<FilterDropdown
				label="Dept"
				options={mockOptions}
				selected={null}
				onSelect={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /Dept/i }));
		const option = screen.getAllByRole("option")[0];
		expect(option.className).toContain("#15D5CA");
	});
});
