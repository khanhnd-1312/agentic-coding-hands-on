import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileDropdown } from "./profile-dropdown";

const mockPush = vi.fn();
const mockPathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
	usePathname: () => mockPathname(),
}));

const mockSignOut = vi.fn();
vi.mock("@/libs/supabase/client", () => ({
	createClient: () => ({
		auth: { signOut: mockSignOut },
	}),
}));

describe("ProfileDropdown", () => {
	const mockOnToggle = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockPathname.mockReturnValue("/");
		mockSignOut.mockResolvedValue({ error: null });
	});

	// --- Phase 2: US3 Toggle + US1 Profile Nav ---

	it("T005: clicking trigger calls onToggle(true) to open dropdown", () => {
		render(<ProfileDropdown isOpen={false} onToggle={mockOnToggle} />);
		fireEvent.click(screen.getByRole("button", { name: "User menu" }));
		expect(mockOnToggle).toHaveBeenCalledWith(true);
	});

	it("T006: clicking trigger again calls onToggle(false) to close dropdown", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		fireEvent.click(screen.getByRole("button", { name: "User menu" }));
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	it("T007: clicking backdrop calls onToggle(false)", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const backdrop = document.querySelector('[aria-hidden="true"]');
		expect(backdrop).not.toBeNull();
		fireEvent.click(backdrop as HTMLElement);
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	it("T008: pressing Escape closes dropdown and returns focus to trigger", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const trigger = screen.getByRole("button", { name: "User menu" });

		fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

		expect(mockOnToggle).toHaveBeenCalledWith(false);
		expect(document.activeElement).toBe(trigger);
	});

	it("T009: dropdown has correct ARIA attributes", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);

		const trigger = screen.getByRole("button", { name: "User menu" });
		expect(trigger).toHaveAttribute("aria-haspopup", "menu");
		expect(trigger).toHaveAttribute("aria-expanded", "true");

		const menu = screen.getByRole("menu");
		expect(menu).toBeInTheDocument();
		expect(menu).toHaveAttribute("aria-labelledby", trigger.id);

		const items = screen.getAllByRole("menuitem");
		expect(items).toHaveLength(2);
	});

	it("T009b: trigger has aria-expanded=false when closed", () => {
		render(<ProfileDropdown isOpen={false} onToggle={mockOnToggle} />);
		const trigger = screen.getByRole("button", { name: "User menu" });
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("T010: clicking Profile menuitem navigates to /profile and closes", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const profileBtn = screen.getByRole("menuitem", { name: /profile/i });
		fireEvent.click(profileBtn);

		expect(mockPush).toHaveBeenCalledWith("/profile");
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	it("dropdown panel has correct design-style classes when open", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");
		expect(menu.className).toContain("bg-[#00070C]");
		expect(menu.className).toContain("border-[#998C5F]");
		expect(menu.className).toContain("rounded-lg");
		expect(menu.className).toContain("z-[100]");
		expect(menu.className).toContain("right-0");
		expect(menu.className).toContain("opacity-100");
	});

	it("dropdown panel has animation classes when closed", () => {
		render(<ProfileDropdown isOpen={false} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");
		expect(menu.className).toContain("opacity-0");
		expect(menu.className).toContain("scale-y-[0.95]");
		expect(menu.className).toContain("pointer-events-none");
	});

	it("Profile item has gold bg + text glow", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const profileBtn = screen.getByRole("menuitem", { name: /profile/i });
		expect(profileBtn.className).toContain("bg-[rgba(255,234,158,0.1)]");
		const span = profileBtn.querySelector("span");
		expect(span?.className).toContain("[text-shadow:");
	});

	it("Logout item has transparent bg with hover highlight", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const logoutBtn = screen.getByRole("menuitem", { name: /logout/i });
		expect(logoutBtn.className).toContain("bg-transparent");
		expect(logoutBtn.className).toContain("hover:bg-[rgba(255,234,158,0.1)]");
	});

	// --- Phase 3: US2 Logout ---

	it("T018: clicking Logout calls supabase.auth.signOut()", async () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const logoutBtn = screen.getByRole("menuitem", { name: /logout/i });
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(mockSignOut).toHaveBeenCalled();
		});
	});

	it("T019: after successful signOut, redirects to /login", async () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		fireEvent.click(screen.getByRole("menuitem", { name: /logout/i }));

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/login");
		});
	});

	it("T020: Logout button shows loading state while signOut processes", async () => {
		mockSignOut.mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
		);
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const logoutBtn = screen.getByRole("menuitem", { name: /logout/i });
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(logoutBtn.className).toContain("opacity-50");
			expect(logoutBtn.className).toContain("pointer-events-none");
			expect(logoutBtn).toBeDisabled();
		});
	});

	it("T021: signOut failure shows error toast", async () => {
		mockSignOut.mockResolvedValue({ error: new Error("Network error") });
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		fireEvent.click(screen.getByRole("menuitem", { name: /logout/i }));

		await waitFor(() => {
			expect(screen.getByRole("status")).toHaveTextContent(
				"Đăng xuất thất bại. Vui lòng thử lại."
			);
		});
		expect(mockPush).not.toHaveBeenCalledWith("/login");
	});

	// --- Phase 4: US4 Keyboard Navigation ---

	it("T026: Enter on trigger opens dropdown and focuses first menuitem", () => {
		render(<ProfileDropdown isOpen={false} onToggle={mockOnToggle} />);
		const trigger = screen.getByRole("button", { name: "User menu" });
		fireEvent.keyDown(trigger, { key: "Enter", code: "Enter" });

		expect(mockOnToggle).toHaveBeenCalledWith(true);
	});

	it("T027: Space on trigger opens dropdown", () => {
		render(<ProfileDropdown isOpen={false} onToggle={mockOnToggle} />);
		const trigger = screen.getByRole("button", { name: "User menu" });
		fireEvent.keyDown(trigger, { key: " ", code: "Space" });

		expect(mockOnToggle).toHaveBeenCalledWith(true);
	});

	it("T028: ArrowDown moves focus to next menuitem (wraps)", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");
		const items = screen.getAllByRole("menuitem");

		// focusedIndex starts at -1. First ArrowDown → index 0
		fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
		expect(items[0]).toHaveAttribute("tabindex", "0");

		// Second ArrowDown → index 1
		fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
		expect(items[1]).toHaveAttribute("tabindex", "0");

		// Third ArrowDown wraps → index 0
		fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
		expect(items[0]).toHaveAttribute("tabindex", "0");
	});

	it("T029: ArrowUp wraps from first to last menuitem", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");
		const items = screen.getAllByRole("menuitem");

		// First ArrowDown to get to index 0
		fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
		expect(items[0]).toHaveAttribute("tabindex", "0");

		// ArrowUp from index 0 wraps to index 1
		fireEvent.keyDown(menu, { key: "ArrowUp", code: "ArrowUp" });
		expect(items[1]).toHaveAttribute("tabindex", "0");
	});

	it("T030: Enter on focused menuitem triggers its action", async () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");

		// ArrowDown to focus Profile (index 0)
		fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });

		// Enter activates Profile → navigate
		fireEvent.keyDown(menu, { key: "Enter", code: "Enter" });
		expect(mockPush).toHaveBeenCalledWith("/profile");
	});

	it("T031: Tab closes dropdown", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		const menu = screen.getByRole("menu");
		fireEvent.keyDown(menu, { key: "Tab", code: "Tab" });

		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	// --- Phase 5: Polish ---

	it("T037: scroll event closes dropdown", () => {
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		fireEvent.scroll(window);
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	it("T038: Profile click on /profile page closes without calling router.push", () => {
		mockPathname.mockReturnValue("/profile");
		render(<ProfileDropdown isOpen={true} onToggle={mockOnToggle} />);
		fireEvent.click(screen.getByRole("menuitem", { name: /profile/i }));

		expect(mockPush).not.toHaveBeenCalled();
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});
});
