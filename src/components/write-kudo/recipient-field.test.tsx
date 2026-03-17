import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecipientField } from "./recipient-field";

const mockSetQuery = vi.fn();
vi.mock("@/hooks/use-user-search", () => ({
  useUserSearch: () => ({
    query: "",
    setQuery: mockSetQuery,
    results: [],
    isLoading: false,
  }),
}));

vi.mock("@/components/ui/icon", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

describe("RecipientField", () => {
  const defaultProps = {
    selectedRecipient: null,
    onSelect: vi.fn(),
  };

  it("renders label with asterisk", () => {
    render(<RecipientField {...defaultProps} />);
    const label = screen.getByText("Người nhận");
    expect(label).toBeDefined();
    expect(label.querySelector("span")?.textContent?.trim()).toBe("*");
  });

  it("renders input with placeholder", () => {
    render(<RecipientField {...defaultProps} />);
    expect(screen.getByPlaceholderText("Tìm kiếm")).toBeDefined();
  });

  it("shows error border when error prop is set", () => {
    const { container } = render(
      <RecipientField {...defaultProps} error="Required" />,
    );
    const borderDiv = container.querySelector(".border-\\[\\#E46060\\]");
    expect(borderDiv).not.toBeNull();
  });

  it("displays selected recipient name", () => {
    const recipient = {
      id: "1",
      name: "Alice Nguyen",
      avatar_url: null,
      department_name: "Eng",
    };
    render(
      <RecipientField
        selectedRecipient={recipient}
        onSelect={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText("Tìm kiếm") as HTMLInputElement;
    expect(input.value).toBe("Alice Nguyen");
  });
});
