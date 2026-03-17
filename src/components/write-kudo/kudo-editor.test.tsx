import { render, screen } from "@testing-library/react";
import { KudoEditor } from "./kudo-editor";

describe("KudoEditor", () => {
	it("renders toolbar buttons", () => {
		render(<KudoEditor onChange={vi.fn()} />);

		// 6 toolbar buttons: bold, italic, strikethrough, list-ordered, link, quote
		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBeGreaterThanOrEqual(6);
	});

	it("renders community standards link", () => {
		render(<KudoEditor onChange={vi.fn()} />);
		expect(screen.getByText("Tiêu chuẩn cộng đồng")).toBeInTheDocument();
	});

	it("renders hint text about @mention", () => {
		render(<KudoEditor onChange={vi.fn()} />);
		expect(
			screen.getByText(
				/Bạn có thể .* để nhắc tới đồng nghiệp khác/,
			),
		).toBeInTheDocument();
	});

	it("renders character counter", () => {
		render(<KudoEditor onChange={vi.fn()} />);
		expect(screen.getByText(/\/1000/)).toBeInTheDocument();
	});

	it("applies error styling when error prop is set", () => {
		const { container } = render(
			<KudoEditor onChange={vi.fn()} error="Required" />,
		);
		const borderElements = container.querySelectorAll("[class*='E46060']");
		expect(borderElements.length).toBeGreaterThan(0);
	});
});
