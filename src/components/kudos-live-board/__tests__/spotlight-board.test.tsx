import { render, screen, fireEvent } from "@testing-library/react";
import { SpotlightBoard } from "../spotlight-board";
import type { SpotlightEntry } from "@/types/kudos";

const mockEntries: SpotlightEntry[] = [
	{ name: "Nguyễn Duy Khánh", user_id: "u1", kudos_count: 50 },
	{ name: "Trần Minh Tú", user_id: "u2", kudos_count: 30 },
	{ name: "Lê Thanh Hải", user_id: "u3", kudos_count: 20 },
	{ name: "Phạm Văn An", user_id: "u4", kudos_count: 10 },
];

describe("SpotlightBoard", () => {
	it("renders with correct aria-label", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		expect(
			screen.getByLabelText(
				"Spotlight Board — interactive word cloud of kudos recipients",
			),
		).toBeInTheDocument();
	});

	it("renders all name nodes", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		expect(screen.getByText("Nguyễn Duy Khánh")).toBeInTheDocument();
		expect(screen.getByText("Trần Minh Tú")).toBeInTheDocument();
		expect(screen.getByText("Lê Thanh Hải")).toBeInTheDocument();
		expect(screen.getByText("Phạm Văn An")).toBeInTheDocument();
	});

	it("renders search input with placeholder", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		expect(
			screen.getByPlaceholderText("Tìm kiếm tên..."),
		).toBeInTheDocument();
	});

	it("limits search input to 100 characters", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		const input = screen.getByPlaceholderText("Tìm kiếm tên...");
		expect(input).toHaveAttribute("maxLength", "100");
	});

	it("highlights matching name on search", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		const input = screen.getByPlaceholderText("Tìm kiếm tên...");
		fireEvent.change(input, { target: { value: "Nguyễn" } });

		// The matching name should have highlight class
		const nameEl = screen.getByText("Nguyễn Duy Khánh");
		expect(nameEl.className).toContain("text-[var(--klb-color-highlight-pink)]");
	});

	it("renders pan/zoom toggle button", () => {
		render(
			<SpotlightBoard
				entries={mockEntries}
				searchPlaceholder="Tìm kiếm tên..."
				panZoomTooltip="Pan/Zoom"
			/>,
		);
		expect(
			screen.getByRole("button", { name: /Pan\/Zoom/i }),
		).toBeInTheDocument();
	});
});
