import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AnonymousToggle } from "./anonymous-toggle";

describe("AnonymousToggle", () => {
  it('renders label "Gửi lời cám ơn và ghi nhận ẩn danh"', () => {
    render(<AnonymousToggle checked={false} onChange={vi.fn()} />);
    expect(
      screen.getByText("Gửi lời cám ơn và ghi nhận ẩn danh"),
    ).toBeDefined();
  });

  it("renders checkbox element", () => {
    render(<AnonymousToggle checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeDefined();
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    render(<AnonymousToggle checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reflects checked state", () => {
    render(<AnonymousToggle checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
      "true",
    );
  });
});
