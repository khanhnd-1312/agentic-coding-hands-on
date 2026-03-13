import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AwardNavMenu } from "./award-nav-menu";

const mockCategories = [
	{ slug: "top-talent", name: "Top Talent" },
	{ slug: "top-project", name: "Top Project" },
	{ slug: "top-project-leader", name: "Top Project Leader" },
	{ slug: "best-manager", name: "Best Manager" },
	{ slug: "signature-creator", name: "Signature 2025" },
	{ slug: "mvp", name: "MVP" },
];

describe("AwardNavMenu", () => {
	let mockObserve: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockObserve = vi.fn();

		const MockIntersectionObserver = class {
			constructor() {
				// no-op
			}
			observe = mockObserve;
			unobserve = vi.fn();
			disconnect = vi.fn();
			takeRecords = vi.fn().mockReturnValue([]);
			root = null;
			rootMargin = "";
			thresholds = [] as number[];
		};

		vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

		// Create DOM elements for scroll targets
		for (const cat of mockCategories) {
			const el = document.createElement("section");
			el.id = cat.slug;
			el.scrollIntoView = vi.fn();
			document.body.appendChild(el);
		}
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
	});

	it("renders 6 nav items in correct order", () => {
		render(<AwardNavMenu categories={mockCategories} />);
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(6);
		expect(buttons[0]).toHaveTextContent("Top Talent");
		expect(buttons[5]).toHaveTextContent("MVP");
	});

	it("first item has aria-current='true' by default", () => {
		render(<AwardNavMenu categories={mockCategories} />);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveAttribute("aria-current", "true");
	});

	it("clicking a nav item calls scrollIntoView on the matching section", async () => {
		const user = userEvent.setup();
		render(<AwardNavMenu categories={mockCategories} />);

		const topProjectButton = screen.getByText("Top Project");
		await user.click(topProjectButton);

		const section = document.getElementById("top-project");
		expect(section?.scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
		});
	});

	it("each item has a target icon prefix", () => {
		const { container } = render(
			<AwardNavMenu categories={mockCategories} />
		);
		const svgs = container.querySelectorAll("button svg");
		expect(svgs).toHaveLength(6);
	});
});
