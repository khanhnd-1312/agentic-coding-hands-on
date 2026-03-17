import { render, screen, fireEvent } from "@testing-library/react";
import { WriteKudoModal } from "./write-kudo-modal";

// Mock all child components to isolate modal behavior
vi.mock("./recipient-field", () => ({
	RecipientField: () => <div data-testid="recipient-field" />,
}));
vi.mock("./danh-hieu-field", () => ({
	DanhHieuField: () => <div data-testid="danh-hieu-field" />,
}));
vi.mock("./kudo-editor", () => ({
	KudoEditor: () => <div data-testid="kudo-editor" />,
}));
vi.mock("./hashtag-field", () => ({
	HashtagField: () => <div data-testid="hashtag-field" />,
}));
vi.mock("./image-upload-field", () => ({
	ImageUploadField: () => <div data-testid="image-upload-field" />,
}));
vi.mock("./anonymous-toggle", () => ({
	AnonymousToggle: () => <div data-testid="anonymous-toggle" />,
}));
vi.mock("@/hooks/use-create-kudo", () => ({
	useCreateKudo: () => ({
		submit: vi.fn().mockResolvedValue(true),
		isSubmitting: false,
		error: null,
	}),
}));

describe("WriteKudoModal", () => {
	it("does not render when isOpen is false", () => {
		render(
			<WriteKudoModal isOpen={false} onClose={vi.fn()} />,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders modal with title when isOpen is true", () => {
		render(
			<WriteKudoModal isOpen={true} onClose={vi.fn()} />,
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByText("Gửi lời cám ơn và ghi nhận đến đồng đội"),
		).toBeInTheDocument();
	});

	it("renders all form sections", () => {
		render(
			<WriteKudoModal isOpen={true} onClose={vi.fn()} />,
		);
		expect(screen.getByTestId("recipient-field")).toBeInTheDocument();
		expect(screen.getByTestId("danh-hieu-field")).toBeInTheDocument();
		expect(screen.getByTestId("kudo-editor")).toBeInTheDocument();
		expect(screen.getByTestId("hashtag-field")).toBeInTheDocument();
		expect(screen.getByTestId("image-upload-field")).toBeInTheDocument();
		expect(screen.getByTestId("anonymous-toggle")).toBeInTheDocument();
	});

	it("renders Hủy and Gửi buttons", () => {
		render(
			<WriteKudoModal isOpen={true} onClose={vi.fn()} />,
		);
		expect(screen.getByText("Hủy")).toBeInTheDocument();
		expect(screen.getByText("Gửi")).toBeInTheDocument();
	});

	it("calls onClose when Hủy button is clicked", () => {
		const onClose = vi.fn();
		render(
			<WriteKudoModal isOpen={true} onClose={onClose} />,
		);
		fireEvent.click(screen.getByText("Hủy"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when Escape key is pressed", () => {
		const onClose = vi.fn();
		render(
			<WriteKudoModal isOpen={true} onClose={onClose} />,
		);
		fireEvent.keyDown(document, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("has aria-modal and aria-labelledby attributes", () => {
		render(
			<WriteKudoModal isOpen={true} onClose={vi.fn()} />,
		);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toHaveAttribute("aria-modal", "true");
		expect(dialog).toHaveAttribute("aria-labelledby", "write-kudo-title");
	});

	it("Gửi button is disabled when form is empty (no fields filled)", () => {
		render(
			<WriteKudoModal isOpen={true} onClose={vi.fn()} />,
		);
		const submitBtn = screen.getByText("Gửi").closest("button");
		expect(submitBtn).toBeDisabled();
	});
});
