import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const pushMock = vi.fn();

vi.mock("next/image", () => ({
	default: ({
		alt,
		...props
	}: {
		alt: string;
		[key: string]: unknown;
	}) => <img alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}));

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({
		push: pushMock,
	})),
}));

// Mock the hook — default: not expired
const hookMock = vi.fn((_params?: unknown) => ({
	days: "05",
	hours: "12",
	minutes: "30",
	isExpired: false,
}));

vi.mock("@/hooks/use-prelaunch-countdown", () => ({
	usePrelaunchCountdown: (params: unknown) => hookMock(params),
}));

import { CountdownPrelaunchPage } from "./countdown-prelaunch-page";

describe("CountdownPrelaunchPage", () => {
	const defaultProps = {
		eventStartTime: "2026-04-01T10:00:00Z",
		serverTime: "2026-03-12T10:00:00Z",
	};

	beforeEach(() => {
		pushMock.mockClear();
		hookMock.mockReturnValue({
			days: "05",
			hours: "12",
			minutes: "30",
			isExpired: false,
		});
	});

	it("renders a <main> landmark", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("renders <h1> heading with Vietnamese text in italic", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toHaveTextContent("Sự kiện sẽ bắt đầu sau");
		expect(heading.className).toMatch(/italic/);
	});

	it("renders background image with alt='' and aria-hidden=true", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		const bgImage = screen.getByAltText("");
		expect(bgImage).toHaveAttribute("aria-hidden", "true");
	});

	it("renders gradient overlay div", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		const overlay = screen.getByTestId("gradient-overlay");
		expect(overlay).toBeInTheDocument();
	});

	it("renders the countdown timer with correct values", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		expect(screen.getByText("DAYS")).toBeInTheDocument();
		expect(screen.getByText("HOURS")).toBeInTheDocument();
		expect(screen.getByText("MINUTES")).toBeInTheDocument();
	});

	// --- US2: Redirect ---

	it("redirects to /login when hook returns isExpired=true", () => {
		hookMock.mockReturnValue({
			days: "00",
			hours: "00",
			minutes: "00",
			isExpired: true,
		});

		render(<CountdownPrelaunchPage {...defaultProps} />);

		expect(pushMock).toHaveBeenCalledWith("/login");
	});

	it("does NOT redirect when isExpired is false", () => {
		render(<CountdownPrelaunchPage {...defaultProps} />);

		expect(pushMock).not.toHaveBeenCalled();
	});
});
