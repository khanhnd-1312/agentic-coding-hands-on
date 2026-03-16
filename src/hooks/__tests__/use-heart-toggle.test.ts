import { renderHook, act } from "@testing-library/react";
import { useHeartToggle } from "../use-heart-toggle";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useHeartToggle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		mockFetch.mockResolvedValue({ ok: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns initial state", () => {
		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: false,
				initialHeartCount: 10,
				isSender: false,
			}),
		);
		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
		expect(result.current.isDisabled).toBe(false);
	});

	it("performs optimistic update on toggle", () => {
		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: false,
				initialHeartCount: 10,
				isSender: false,
			}),
		);

		act(() => {
			result.current.toggle();
		});

		expect(result.current.isLiked).toBe(true);
		expect(result.current.heartCount).toBe(11);
	});

	it("calls POST API when liking", async () => {
		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: false,
				initialHeartCount: 10,
				isSender: false,
			}),
		);

		act(() => {
			result.current.toggle();
		});

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/kudos/k1/like", {
			method: "POST",
		});
	});

	it("calls DELETE API when unliking", async () => {
		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: true,
				initialHeartCount: 10,
				isSender: false,
			}),
		);

		act(() => {
			result.current.toggle();
		});

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/kudos/k1/like", {
			method: "DELETE",
		});
	});

	it("reverts on API error", async () => {
		mockFetch.mockResolvedValue({ ok: false });

		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: false,
				initialHeartCount: 10,
				isSender: false,
			}),
		);

		act(() => {
			result.current.toggle();
		});

		// Optimistic state
		expect(result.current.isLiked).toBe(true);
		expect(result.current.heartCount).toBe(11);

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		// Reverted
		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
	});

	it("is disabled when user is sender", () => {
		const { result } = renderHook(() =>
			useHeartToggle({
				kudosId: "k1",
				initialIsLiked: false,
				initialHeartCount: 10,
				isSender: true,
			}),
		);

		expect(result.current.isDisabled).toBe(true);

		act(() => {
			result.current.toggle();
		});

		// No change — sender cannot toggle
		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
	});
});
