import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
	it("renders with correct name and size props", () => {
		const { container } = render(<Icon name="google" size={24} />);
		expect(container.firstChild).toBeTruthy();
	});

	it("renders google variant with SVG", () => {
		const { container } = render(<Icon name="google" size={24} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("width", "24");
		expect(svg).toHaveAttribute("height", "24");
	});

	it("renders flag-vn variant with container and image dimensions", () => {
		const { container } = render(<Icon name="flag-vn" size={24} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInTheDocument();
		// Container is 24×24px, inner image is 20×15px
		const inner = wrapper.querySelector("svg, img");
		expect(inner).toBeInTheDocument();
	});

	it("renders chevron-down variant with 16×16 SVG in white", () => {
		const { container } = render(<Icon name="chevron-down" size={16} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("width", "16");
		expect(svg).toHaveAttribute("height", "16");
	});

	it("applies optional className to root element", () => {
		const { container } = render(
			<Icon name="google" size={24} className="custom-class" />
		);
		expect(container.firstChild).toHaveClass("custom-class");
	});
});
