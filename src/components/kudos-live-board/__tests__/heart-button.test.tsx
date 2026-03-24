import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeartButton } from "../heart-button";
import { KudoLikeProvider } from "@/contexts/kudo-like-context";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
	return (
		<KudoLikeProvider initialKudos={[
			{ id: "k1", is_liked_by_me: false, heart_count: 10 },
			{ id: "k1-liked", is_liked_by_me: true, heart_count: 5 },
		]}>
			{children}
		</KudoLikeProvider>
	);
}

// Mock fetch for toggle tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("HeartButton", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ kudo_id: "k1", heart_count: 11, tim_awarded: 1 }),
		});
	});

	it("renders heart count", () => {
		render(
			<KudoLikeProvider initialKudos={[{ id: "k1", is_liked_by_me: false, heart_count: 42 }]}>
				<HeartButton kudosId="k1" initialIsLiked={false} initialHeartCount={42} isSender={false} />
			</KudoLikeProvider>,
		);
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("toggles from inactive to active on click", async () => {
		const user = userEvent.setup();
		render(
			<KudoLikeProvider initialKudos={[{ id: "k1", is_liked_by_me: false, heart_count: 10 }]}>
				<HeartButton kudosId="k1" initialIsLiked={false} initialHeartCount={10} isSender={false} />
			</KudoLikeProvider>,
		);
		const button = screen.getByRole("button");
		await user.click(button);
		expect(screen.getByText("11")).toBeInTheDocument();
	});

	it("toggles from active to inactive on click", async () => {
		const user = userEvent.setup();
		render(
			<KudoLikeProvider initialKudos={[{ id: "k1", is_liked_by_me: true, heart_count: 10 }]}>
				<HeartButton kudosId="k1" initialIsLiked={true} initialHeartCount={10} isSender={false} />
			</KudoLikeProvider>,
		);
		const button = screen.getByRole("button");
		await user.click(button);
		expect(screen.getByText("9")).toBeInTheDocument();
	});

	it("is disabled when isSender is true", () => {
		render(
			wrapper({
				children: (
					<HeartButton kudosId="k1" initialIsLiked={false} initialHeartCount={5} isSender={true} />
				),
			}),
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("has correct aria-pressed state", () => {
		render(
			<KudoLikeProvider initialKudos={[{ id: "k1", is_liked_by_me: true, heart_count: 5 }]}>
				<HeartButton kudosId="k1" initialIsLiked={true} initialHeartCount={5} isSender={false} />
			</KudoLikeProvider>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-pressed", "true");
	});

	it("has Vietnamese aria-label when not liked", () => {
		render(
			wrapper({
				children: (
					<HeartButton kudosId="k1" initialIsLiked={false} initialHeartCount={5} isSender={false} />
				),
			}),
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-label", "Thích kudo này");
	});

	it("has Vietnamese aria-label when liked", () => {
		render(
			<KudoLikeProvider initialKudos={[{ id: "k1", is_liked_by_me: true, heart_count: 5 }]}>
				<HeartButton kudosId="k1" initialIsLiked={true} initialHeartCount={5} isSender={false} />
			</KudoLikeProvider>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-label", "Bỏ thích kudo này");
	});

	it("renders Toast when API call fails", async () => {
		mockFetch.mockResolvedValue({ ok: false });
		vi.useFakeTimers();

		render(
			wrapper({
				children: (
					<HeartButton kudosId="k1" initialIsLiked={false} initialHeartCount={5} isSender={false} />
				),
			}),
		);

		const button = screen.getByRole("button");

		// Fire click and advance past debounce
		await act(async () => {
			fireEvent.click(button);
		});
		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText("Không thể thực hiện thao tác. Vui lòng thử lại.")).toBeInTheDocument();

		vi.useRealTimers();
	});
});
