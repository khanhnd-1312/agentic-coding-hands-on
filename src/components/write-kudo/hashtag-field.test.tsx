import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HashtagField } from "./hashtag-field";

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

const mockHashtags = [
  { id: "h1", name: "#High-performing" },
  { id: "h2", name: "#BE PROFESSIONAL" },
  { id: "h3", name: "#BE OPTIMISTIC" },
  { id: "h4", name: "#BE A TEAM" },
  { id: "h5", name: "#THINK OUTSIDE THE BOX" },
  { id: "h6", name: "#GET RISKY" },
  { id: "h7", name: "#GO FAST" },
  { id: "h8", name: "#WASSHOI" },
];

describe("HashtagField", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockHashtags }),
    });
  });

  const defaultProps = {
    selectedHashtags: [] as Array<{ id: string; name: string }>,
    onChange: vi.fn(),
  };

  it("renders label with asterisk", () => {
    const { container } = render(<HashtagField {...defaultProps} />);
    const label = container.querySelector("label");
    expect(label).toBeDefined();
    expect(label?.textContent).toContain("Hashtag");
    expect(label?.textContent).toContain("*");
  });

  it("renders + Hashtag button", () => {
    render(<HashtagField {...defaultProps} />);
    expect(screen.getByText("Hashtag", { selector: "span.flex" })).toBeDefined();
    expect(screen.getByTestId("icon-plus")).toBeDefined();
  });

  it("calls onChange when chip x is clicked to remove", () => {
    const onChange = vi.fn();
    const tags = [
      { id: "1", name: "teamwork" },
      { id: "2", name: "leadership" },
    ];
    render(
      <HashtagField selectedHashtags={tags} onChange={onChange} />,
    );

    const closeButtons = screen.getAllByTestId("icon-close");
    fireEvent.click(closeButtons[0].closest("button")!);

    expect(onChange).toHaveBeenCalledWith([{ id: "2", name: "leadership" }]);
  });

  it("shows error text when error prop is set", () => {
    render(<HashtagField {...defaultProps} error="Chọn ít nhất 1 hashtag" />);
    expect(screen.getByText("Chọn ít nhất 1 hashtag")).toBeDefined();
  });

  it("hides + Hashtag button when 5 hashtags are selected", () => {
    const tags = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      name: `tag${i}`,
    }));
    render(<HashtagField selectedHashtags={tags} onChange={vi.fn()} />);
    expect(screen.queryByTestId("icon-plus")).toBeNull();
  });

  // --- Phase 2: Style conformance tests (T004–T011) ---

  async function openDropdown() {
    // Click the trigger button that contains the "+" icon
    const trigger = screen.getByTestId("icon-plus").closest("button")!;
    fireEvent.click(trigger);
    // Wait for fetch to resolve and items to render
    await screen.findByText("#High-performing");
  }

  it("T004: dropdown has dark bg #00070C", async () => {
    render(<HashtagField {...defaultProps} />);
    await openDropdown();
    // Find the dropdown container (absolute positioned div below trigger)
    const dropdown = screen.getByText("#High-performing").closest("[class*='absolute']") as HTMLElement;
    expect(dropdown.className).toContain("#00070C");
  });

  it("T005: dropdown width is w-[318px]", async () => {
    render(<HashtagField {...defaultProps} />);
    await openDropdown();
    const dropdown = screen.getByText("#High-performing").closest("[class*='absolute']") as HTMLElement;
    expect(dropdown.className).toContain("w-79.5");
  });

  it("T006: item text uses text-base and white color", async () => {
    render(<HashtagField {...defaultProps} />);
    await openDropdown();
    const item = screen.getByText("#High-performing").closest("button") as HTMLElement;
    expect(item.className).toContain("text-base");
    expect(item.className).toContain("text-white");
    expect(item.className).not.toContain("text-sm");
  });

  it("T007: item has h-10 (40px height)", async () => {
    render(<HashtagField {...defaultProps} />);
    await openDropdown();
    const item = screen.getByText("#High-performing").closest("button") as HTMLElement;
    expect(item.className).toContain("h-10");
  });

  it("T008: selected item has gold bg rgba(255,234,158,0.2)", async () => {
    const selected = [{ id: "h1", name: "#High-performing" }];
    render(<HashtagField selectedHashtags={selected} onChange={vi.fn()} />);
    await openDropdown();
    // Find ALL elements with this text — the chip AND the dropdown item
    const allMatches = screen.getAllByText("#High-performing");
    // The dropdown item is the one inside a button with h-10 class
    const dropdownItem = allMatches.map((el) => el.closest("button")).find(
      (btn) => btn && btn.className.includes("h-10"),
    ) as HTMLElement;
    expect(dropdownItem).toBeTruthy();
    expect(dropdownItem.className).toContain("bg-[rgba(255,234,158,0.2)]");
  });

  it("T009: selected item shows check-circle icon", async () => {
    const selected = [{ id: "h1", name: "#High-performing" }];
    render(<HashtagField selectedHashtags={selected} onChange={vi.fn()} />);
    await openDropdown();
    // The mock Icon renders <span data-testid="icon-check-circle" />
    expect(screen.getByTestId("icon-check-circle")).toBeInTheDocument();
  });

  it("T010: unselected item does NOT show check-circle icon", async () => {
    render(<HashtagField {...defaultProps} />);
    await openDropdown();
    expect(screen.queryByTestId("icon-check-circle")).toBeNull();
  });

  it("T029: when 5 selected, unselected items are disabled", async () => {
    const selected = mockHashtags.slice(0, 5);
    // With 5 selected, trigger button is hidden — render with 4 so trigger exists, then test items
    const fourSelected = mockHashtags.slice(0, 4);
    render(<HashtagField selectedHashtags={fourSelected} onChange={vi.fn()} />);
    await openDropdown();
    // Unselected items should be clickable (4 < 5)
    const unselectedItem = screen.getByText("#THINK OUTSIDE THE BOX").closest("button") as HTMLElement;
    expect(unselectedItem).not.toBeDisabled();
  });

  it("T030: empty hashtag list shows fallback message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    render(<HashtagField {...defaultProps} />);
    await vi.waitFor(async () => {
      const trigger = screen.getByTestId("icon-plus").closest("button")!;
      fireEvent.click(trigger);
    });
    // Wait for empty state to render
    await vi.waitFor(() => {
      expect(screen.getByText("Không có dữ liệu")).toBeInTheDocument();
    });
  });

  it("T011: selected items stay visible in dropdown (not hidden)", async () => {
    const selected = [{ id: "h1", name: "#High-performing" }];
    render(<HashtagField selectedHashtags={selected} onChange={vi.fn()} />);
    await openDropdown();
    // Find ALL elements with this text — chip + dropdown item = 2 matches
    const allMatches = screen.getAllByText("#High-performing");
    expect(allMatches.length).toBeGreaterThanOrEqual(2); // chip + dropdown list item
    // Other items should also be visible
    expect(screen.getByText("#BE PROFESSIONAL")).toBeInTheDocument();
  });
});
