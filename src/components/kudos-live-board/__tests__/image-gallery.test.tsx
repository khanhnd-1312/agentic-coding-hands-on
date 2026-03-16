import { render, screen } from "@testing-library/react";
import { ImageGallery } from "../image-gallery";

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => <img {...props} />,
}));

describe("ImageGallery", () => {
	it("renders up to 5 thumbnail images", () => {
		const images = [
			"https://example.com/1.jpg",
			"https://example.com/2.jpg",
			"https://example.com/3.jpg",
			"https://example.com/4.jpg",
			"https://example.com/5.jpg",
			"https://example.com/6.jpg",
		];
		render(<ImageGallery images={images} />);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(5);
	});

	it("renders all images when fewer than 5", () => {
		const images = ["https://example.com/1.jpg", "https://example.com/2.jpg"];
		render(<ImageGallery images={images} />);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(2);
	});

	it("renders nothing when images array is empty", () => {
		const { container } = render(<ImageGallery images={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it("each image opens full image on click", () => {
		const images = ["https://example.com/1.jpg"];
		render(<ImageGallery images={images} />);
		const links = screen.getAllByRole("link");
		expect(links[0]).toHaveAttribute("href", "https://example.com/1.jpg");
		expect(links[0]).toHaveAttribute("target", "_blank");
	});
});
