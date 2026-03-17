import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DanhHieuField } from "./danh-hieu-field";

describe("DanhHieuField", () => {
  it('renders label "Danh hiệu" with red asterisk', () => {
    const { container } = render(<DanhHieuField value="" onChange={vi.fn()} />);
    const label = container.querySelector("label");
    expect(label).toBeDefined();
    expect(label?.textContent).toContain("Danh hiệu");
    expect(label?.textContent).toContain("*");
  });

  it("renders input with correct placeholder", () => {
    render(<DanhHieuField value="" onChange={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Dành tặng một danh hiệu cho đồng đội"),
    ).toBeDefined();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<DanhHieuField value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText(
      "Dành tặng một danh hiệu cho đồng đội",
    );
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(onChange).toHaveBeenCalledWith("Hello");
  });

  it("renders 2-line hint text", () => {
    render(<DanhHieuField value="" onChange={vi.fn()} />);
    expect(
      screen.getByText("Ví dụ: Người truyền động lực cho tôi."),
    ).toBeDefined();
    expect(
      screen.getByText("Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."),
    ).toBeDefined();
  });

  it("shows character counter", () => {
    render(<DanhHieuField value="Hello" onChange={vi.fn()} />);
    expect(screen.getByText("45/50")).toBeDefined();
  });

  it("shows error border when error prop is set", () => {
    render(
      <DanhHieuField value="" onChange={vi.fn()} error="Required field" />,
    );
    const input = screen.getByPlaceholderText(
      "Dành tặng một danh hiệu cho đồng đội",
    );
    expect(input.className).toContain("E46060");
  });
});
