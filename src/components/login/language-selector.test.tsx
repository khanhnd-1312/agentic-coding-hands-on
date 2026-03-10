import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageSelector } from "./language-selector";

describe("LanguageSelector", () => {
	const mockOnLangChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Reset cookies
		document.cookie = "lang=; max-age=0; path=/";
	});

	it("renders VN flag, VN text, and chevron in default (vi) state", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		// The button should contain "VN" text
		expect(screen.getByText("VN")).toBeInTheDocument();
		// button has aria attributes
		const button = screen.getByRole("button", { name: "Select language" });
		expect(button).toHaveAttribute("aria-haspopup", "listbox");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("opens dropdown on click and sets aria-expanded to true", async () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", { name: "Select language" });
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");
		// Dropdown list is visible
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("selecting EN calls onLangChange with 'en', writes cookie, closes dropdown", async () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Select language" }));

		const enOption = screen.getByRole("option", { name: /English|EN/i });
		fireEvent.click(enOption);

		expect(mockOnLangChange).toHaveBeenCalledWith("en");
		expect(document.cookie).toContain("lang=en");
		// Dropdown should close
		expect(
			screen.getByRole("button", { name: "Select language" })
		).toHaveAttribute("aria-expanded", "false");
	});

	it("backdrop click closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Select language" }));
		expect(screen.getByRole("listbox")).toBeInTheDocument();

		// Click the backdrop
		const backdrop = document.querySelector('[aria-hidden="true"]');
		if (backdrop) fireEvent.click(backdrop as HTMLElement);

		expect(
			screen.getByRole("button", { name: "Select language" })
		).toHaveAttribute("aria-expanded", "false");
	});

	it("Escape key closes dropdown", () => {
		render(<LanguageSelector lang="vi" onLangChange={mockOnLangChange} />);
		const button = screen.getByRole("button", { name: "Select language" });
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");

		fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("displays EN label when lang prop is en", () => {
		render(<LanguageSelector lang="en" onLangChange={mockOnLangChange} />);
		expect(screen.getByText("EN")).toBeInTheDocument();
	});
});
