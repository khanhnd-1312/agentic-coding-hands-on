import { renderHook, act } from "@testing-library/react";
import { useInfiniteScroll } from "../use-infinite-scroll";

// Mock IntersectionObserver — capture the latest callback
let latestCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
	constructor(callback: IntersectionObserverCallback) {
		latestCallback = callback;
	}
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

function triggerIntersection() {
	latestCallback(
		[{ isIntersecting: true } as IntersectionObserverEntry],
		{} as IntersectionObserver,
	);
}

describe("useInfiniteScroll", () => {
	const mockFetchPage = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockFetchPage.mockResolvedValue({
			data: [{ id: "item-2" }],
			has_more: true,
		});
	});

	it("returns initial data", () => {
		const { result } = renderHook(() =>
			useInfiniteScroll({
				fetchPage: mockFetchPage,
				initialData: [{ id: "item-1" }],
				initialHasMore: true,
			}),
		);

		expect(result.current.items).toEqual([{ id: "item-1" }]);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasMore).toBe(true);
	});

	it("appends new items when intersection triggers", async () => {
		const { result } = renderHook(() =>
			useInfiniteScroll({
				fetchPage: mockFetchPage,
				initialData: [{ id: "item-1" }],
				initialHasMore: true,
			}),
		);

		// Attach sentinel to register the observer
		const node = document.createElement("div");
		act(() => {
			result.current.sentinelRef(node);
		});

		// Trigger intersection and wait for async fetch
		await act(async () => {
			triggerIntersection();
			// Allow the promise to resolve
			await new Promise((r) => setTimeout(r, 0));
		});

		expect(mockFetchPage).toHaveBeenCalledWith(2);
		expect(result.current.items).toEqual([
			{ id: "item-1" },
			{ id: "item-2" },
		]);
	});

	it("sets hasMore to false when no more items", async () => {
		mockFetchPage.mockResolvedValue({ data: [], has_more: false });

		const { result } = renderHook(() =>
			useInfiniteScroll({
				fetchPage: mockFetchPage,
				initialData: [{ id: "item-1" }],
				initialHasMore: true,
			}),
		);

		const node = document.createElement("div");
		act(() => {
			result.current.sentinelRef(node);
		});

		await act(async () => {
			triggerIntersection();
			await new Promise((r) => setTimeout(r, 0));
		});

		expect(result.current.hasMore).toBe(false);
	});

	it("handles fetch error", async () => {
		mockFetchPage.mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() =>
			useInfiniteScroll({
				fetchPage: mockFetchPage,
				initialData: [{ id: "item-1" }],
				initialHasMore: true,
			}),
		);

		const node = document.createElement("div");
		act(() => {
			result.current.sentinelRef(node);
		});

		await act(async () => {
			triggerIntersection();
			await new Promise((r) => setTimeout(r, 0));
		});

		expect(result.current.error).toBe("Network error");
		expect(result.current.items).toEqual([{ id: "item-1" }]);
	});

	it("resets state correctly", () => {
		const { result } = renderHook(() =>
			useInfiniteScroll({
				fetchPage: mockFetchPage,
				initialData: [{ id: "item-1" }],
				initialHasMore: true,
			}),
		);

		act(() => {
			result.current.reset([{ id: "new-1" }], true);
		});

		expect(result.current.items).toEqual([{ id: "new-1" }]);
		expect(result.current.hasMore).toBe(true);
	});
});
