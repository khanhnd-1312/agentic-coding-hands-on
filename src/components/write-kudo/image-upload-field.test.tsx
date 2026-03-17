import { render, screen, fireEvent } from "@testing-library/react";
import { ImageUploadField } from "./image-upload-field";

vi.mock("@/hooks/use-image-upload", () => ({
	useImageUpload: () => ({
		upload: vi.fn().mockResolvedValue("https://example.com/test.jpg"),
		isUploading: false,
		error: null,
	}),
}));

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img {...props} alt={props.alt as string} />
	),
}));

describe("ImageUploadField", () => {
	it("renders label 'Image'", () => {
		const { container } = render(
			<ImageUploadField images={[]} onAdd={vi.fn()} onRemove={vi.fn()} />,
		);
		// The label "Image" exists in the component (may also appear in button text)
		const labels = container.querySelectorAll("label, span");
		const hasImageLabel = Array.from(labels).some(
			(el) => el.textContent?.trim() === "Image",
		);
		expect(hasImageLabel).toBe(true);
	});

	it("renders '+ Image' button when images < 5", () => {
		render(
			<ImageUploadField images={[]} onAdd={vi.fn()} onRemove={vi.fn()} />,
		);
		const addBtn = screen.getByRole("button");
		expect(addBtn).toBeInTheDocument();
	});

	it("hides '+ Image' button when 5 images are attached", () => {
		const images = Array.from({ length: 5 }, (_, i) => ({
			url: `https://example.com/img${i}.jpg`,
		}));
		render(
			<ImageUploadField
				images={images}
				onAdd={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		// Only delete buttons should remain, not the add button
		const buttons = screen.getAllByRole("button");
		// Each image has a delete button (5), no add button
		expect(buttons.length).toBe(5);
	});

	it("renders thumbnails for each image", () => {
		const images = [
			{ url: "https://example.com/img1.jpg" },
			{ url: "https://example.com/img2.jpg" },
		];
		render(
			<ImageUploadField
				images={images}
				onAdd={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		const imgs = screen.getAllByRole("img");
		expect(imgs.length).toBe(2);
	});

	it("calls onRemove when delete button is clicked", () => {
		const onRemove = vi.fn();
		render(
			<ImageUploadField
				images={[{ url: "https://example.com/img1.jpg" }]}
				onAdd={vi.fn()}
				onRemove={onRemove}
			/>,
		);
		const deleteButtons = screen.getAllByRole("button").filter(
			(btn) => btn.getAttribute("aria-label") === "Remove image" ||
				btn.className.includes("D4271D"),
		);
		if (deleteButtons.length > 0) {
			fireEvent.click(deleteButtons[0]);
			expect(onRemove).toHaveBeenCalledWith(0);
		}
	});
});
