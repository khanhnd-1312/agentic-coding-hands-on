import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HashtagField } from "./hashtag-field";

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

describe("HashtagField", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
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
});
