import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CopyLinkButton } from "../copy-link-button";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
	vi.clearAllMocks();
	Object.assign(navigator, {
		clipboard: { writeText: writeTextMock },
	});
});

describe("CopyLinkButton", () => {
	it("renders copy link text", () => {
		render(<CopyLinkButton kudosId="k1" />);
		expect(screen.getByText("Copy Link")).toBeInTheDocument();
	});

	it("copies kudos URL to clipboard on click", async () => {
		render(<CopyLinkButton kudosId="k1" />);
		fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

		await waitFor(() => {
			expect(writeTextMock).toHaveBeenCalledWith(
				expect.stringContaining("/kudo/k1"),
			);
		});
	});

	it("shows toast after copying", async () => {
		render(<CopyLinkButton kudosId="k1" />);
		fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

		await waitFor(() => {
			expect(
				screen.getByText("Link copied — ready to share!"),
			).toBeInTheDocument();
		});
	});

	it("hides toast after timeout", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		render(<CopyLinkButton kudosId="k1" />);

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: /copy link/i }));
		});

		expect(
			screen.getByText("Link copied — ready to share!"),
		).toBeInTheDocument();

		await act(async () => {
			vi.advanceTimersByTime(3000);
		});

		expect(
			screen.queryByText("Link copied — ready to share!"),
		).not.toBeInTheDocument();

		vi.useRealTimers();
	});

	it("has hover and focus styles", () => {
		render(<CopyLinkButton kudosId="k1" />);
		const btn = screen.getByRole("button", { name: /copy link/i });
		expect(btn.className).toContain("hover:opacity-80");
		expect(btn.className).toContain("hover:underline");
	});
});
