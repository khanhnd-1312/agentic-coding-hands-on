import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageSelector } from "./language-selector";

describe("LanguageSelector", () => {
	const mockOnLangChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		document.cookie = "lang=; max-age=0; path=/";
	});

	// --- Phase 2: Visual + Toggle (US1 + US2) ---

	it("renders VN flag, VN text, and chevron in default (vi) state", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		expect(screen.getByText("VN")).toBeInTheDocument();
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		expect(button).toHaveAttribute("aria-haspopup", "listbox");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("renders flag-en icon in trigger when lang is en", () => {
		const { container } = render(
			<LanguageSelector lang="en" onLangChange={mockOnLangChange} />
		);
		expect(screen.getByText("EN")).toBeInTheDocument();
		// Should contain flag-en SVG (Union Jack has #012169 blue)
		const svgs = container.querySelectorAll("svg");
		const hasFlagEn = Array.from(svgs).some(
			(svg) => svg.querySelector('[fill="#012169"]') !== null
		);
		expect(hasFlagEn).toBe(true);
	});

	it("renders flag-vn icon in trigger when lang is vi", () => {
		const { container } = render(
			<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />
		);
		// Should contain flag-vn SVG (Vietnam flag has #E31D1C red)
		const svgs = container.querySelectorAll("svg");
		const hasFlagVn = Array.from(svgs).some(
			(svg) => svg.querySelector('[fill="#E31D1C"]') !== null
		);
		expect(hasFlagVn).toBe(true);
	});

	it("opens dropdown on click and sets aria-expanded to true", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("dropdown container has Figma gold theme styling", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("bg-[#00070C]");
		expect(listbox.className).toContain("border-[#998C5F]");
		expect(listbox.className).toContain("rounded-lg");
		expect(listbox.className).toContain("z-[100]");
	});

	it("selected option has gold highlight background", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const selectedOption = screen.getByRole("option", { name: /VN/i });
		expect(selectedOption.className).toContain(
			"bg-[rgba(255,234,158,0.2)]"
		);
		const unselectedOption = screen.getByRole("option", { name: /EN/i });
		expect(unselectedOption.className).not.toContain(
			"bg-[rgba(255,234,158,0.2)]"
		);
	});

	it("option items render flag icon + short code label", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const vnOption = screen.getByRole("option", { name: /VN/i });
		const enOption = screen.getByRole("option", { name: /EN/i });
		// Options should contain flag SVGs
		expect(vnOption.querySelector("svg")).toBeInTheDocument();
		expect(enOption.querySelector("svg")).toBeInTheDocument();
		// Options should show short codes, not full names
		expect(vnOption.textContent).toContain("VN");
		expect(vnOption.textContent).not.toContain("Tiếng Việt");
		expect(enOption.textContent).toContain("EN");
		expect(enOption.textContent).not.toContain("English");
	});

	it("selecting EN calls onLangChange, writes cookie, closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const enOption = screen.getByRole("option", { name: /EN/i });
		fireEvent.click(enOption);

		expect(mockOnLangChange).toHaveBeenCalledWith("en");
		expect(document.cookie).toContain("lang=en");
		expect(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		).toHaveAttribute("aria-expanded", "false");
	});

	it("backdrop click closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		expect(screen.getByRole("listbox")).toBeInTheDocument();

		const backdrop = document.querySelector('[aria-hidden="true"]');
		if (backdrop) fireEvent.click(backdrop as HTMLElement);

		expect(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		).toHaveAttribute("aria-expanded", "false");
	});

	it("Escape key closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");

		fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("scroll event closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");

		fireEvent.scroll(window);
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("displays EN label when lang prop is en", () => {
		render(<LanguageSelector lang="en" onLangChange={mockOnLangChange} />);
		expect(screen.getByText("EN")).toBeInTheDocument();
	});

	// --- Phase 3: Keyboard Navigation (US4) ---

	it("trigger has aria-label 'Chọn ngôn ngữ' when lang is vi", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		expect(button).toHaveAttribute("aria-label", "Chọn ngôn ngữ");
	});

	it("trigger has aria-label 'Select language' when lang is en", () => {
		render(<LanguageSelector lang="en" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Select language",
		});
		expect(button).toHaveAttribute("aria-label", "Select language");
	});

	it("dropdown has role=listbox and aria-labelledby pointing to trigger id", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.click(button);
		const listbox = screen.getByRole("listbox");
		expect(listbox).toHaveAttribute("aria-labelledby", button.id);
		expect(button.id).toBeTruthy();
	});

	it("each option has role=option and correct aria-selected", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const vnOption = screen.getByRole("option", { name: /VN/i });
		const enOption = screen.getByRole("option", { name: /EN/i });
		expect(vnOption).toHaveAttribute("aria-selected", "true");
		expect(enOption).toHaveAttribute("aria-selected", "false");
	});

	it("Enter on trigger opens dropdown and focuses selected option", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
		expect(button).toHaveAttribute("aria-expanded", "true");
		const listbox = screen.getByRole("listbox");
		expect(listbox).toBeInTheDocument();
		// Selected option (VN) should have tabIndex 0
		const vnOption = screen.getByRole("option", { name: /VN/i });
		expect(vnOption).toHaveAttribute("tabindex", "0");
	});

	it("Space on trigger opens dropdown and focuses selected option", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: " ", code: "Space" });
		expect(button).toHaveAttribute("aria-expanded", "true");
		const vnOption = screen.getByRole("option", { name: /VN/i });
		expect(vnOption).toHaveAttribute("tabindex", "0");
	});

	it("ArrowDown moves focus to next option (wraps EN → VN)", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		// Initially focused on VN (index 0), ArrowDown → EN (index 1)
		fireEvent.keyDown(listbox, { key: "ArrowDown", code: "ArrowDown" });
		const enOption = screen.getByRole("option", { name: /EN/i });
		expect(enOption).toHaveAttribute("tabindex", "0");

		// ArrowDown again wraps → VN (index 0)
		fireEvent.keyDown(listbox, { key: "ArrowDown", code: "ArrowDown" });
		const vnOption = screen.getByRole("option", { name: /VN/i });
		expect(vnOption).toHaveAttribute("tabindex", "0");
	});

	it("ArrowUp moves focus to previous option (wraps VN → EN)", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		// Initially focused on VN (index 0), ArrowUp wraps → EN (index 1)
		fireEvent.keyDown(listbox, { key: "ArrowUp", code: "ArrowUp" });
		const enOption = screen.getByRole("option", { name: /EN/i });
		expect(enOption).toHaveAttribute("tabindex", "0");
	});

	it("Enter on focused option selects it and closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		// Move to EN
		fireEvent.keyDown(listbox, { key: "ArrowDown", code: "ArrowDown" });
		// Select EN
		fireEvent.keyDown(listbox, { key: "Enter", code: "Enter" });

		expect(mockOnLangChange).toHaveBeenCalledWith("en");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("Space on focused option selects it and closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		fireEvent.keyDown(listbox, { key: "ArrowDown", code: "ArrowDown" });
		fireEvent.keyDown(listbox, { key: " ", code: "Space" });

		expect(mockOnLangChange).toHaveBeenCalledWith("en");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("Escape closes dropdown and returns focus to trigger", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		fireEvent.keyDown(listbox, { key: "Escape", code: "Escape" });

		expect(button).toHaveAttribute("aria-expanded", "false");
		expect(document.activeElement).toBe(button);
	});

	it("Tab closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const listbox = screen.getByRole("listbox");
		fireEvent.keyDown(listbox, { key: "Tab", code: "Tab" });

		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("focused option has visible focus ring classes", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", {
			name: "Chọn ngôn ngữ",
		});
		fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

		const vnOption = screen.getByRole("option", { name: /VN/i });
		expect(vnOption.className).toContain("focus-visible:outline-2");
		expect(vnOption.className).toContain(
			"focus-visible:outline-[#998C5F]"
		);
	});

	// --- Controlled Mode ---

	it("uses controlled isOpen prop when provided", () => {
		const mockToggle = vi.fn();
		render(
			<LanguageSelector
				lang="vi"
				onLangChange={mockOnLangChange}
				isOpen={true}
				onToggle={mockToggle}
			/>
		);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("calls onToggle when trigger clicked in controlled mode", () => {
		const mockToggle = vi.fn();
		render(
			<LanguageSelector
				lang="vi"
				onLangChange={mockOnLangChange}
				isOpen={false}
				onToggle={mockToggle}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
		expect(mockToggle).toHaveBeenCalledWith(true);
	});

	it("falls back to internal state when isOpen/onToggle not provided", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", { name: "Chọn ngôn ngữ" });
		expect(button).toHaveAttribute("aria-expanded", "false");
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	// --- Phase 4: Persistence + Edge Cases (US3) ---

	it("clicking already-selected option closes dropdown without calling onLangChange", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		);
		const vnOption = screen.getByRole("option", { name: /VN/i });
		fireEvent.click(vnOption);

		expect(mockOnLangChange).not.toHaveBeenCalled();
		expect(document.cookie).not.toContain("lang=vi");
		expect(
			screen.getByRole("button", { name: "Chọn ngôn ngữ" })
		).toHaveAttribute("aria-expanded", "false");
	});

	it("dropdown renders correctly with lang=en (flag-en + EN in trigger and selected)", () => {
		const { container } = render(
			<LanguageSelector lang="en" onLangChange={mockOnLangChange} />
		);
		// Trigger shows EN
		expect(screen.getByText("EN")).toBeInTheDocument();
		// Trigger has flag-en
		const triggerSvgs = container.querySelectorAll(
			'button[aria-label="Select language"] svg'
		);
		const hasFlagEn = Array.from(triggerSvgs).some(
			(svg) => svg.querySelector('[fill="#012169"]') !== null
		);
		expect(hasFlagEn).toBe(true);

		// Open dropdown and check EN is selected
		fireEvent.click(
			screen.getByRole("button", { name: "Select language" })
		);
		const enOption = screen.getByRole("option", { name: /EN/i });
		expect(enOption).toHaveAttribute("aria-selected", "true");
		expect(enOption.className).toContain("bg-[rgba(255,234,158,0.2)]");
	});
});
