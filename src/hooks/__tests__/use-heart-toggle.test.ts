import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { useHeartToggle } from "../use-heart-toggle";
import { KudoLikeProvider } from "@/contexts/kudo-like-context";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeWrapper(kudos = [{ id: "k1", is_liked_by_me: false, heart_count: 10 }]) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return createElement(KudoLikeProvider, { initialKudos: kudos }, children);
	};
}

describe("useHeartToggle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		mockFetch.mockResolvedValue({ ok: true, json: async () => ({ kudo_id: "k1", heart_count: 11, tim_awarded: 1 }) });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns initial state", () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);
		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
		expect(result.current.isDisabled).toBe(false);
	});

	it("performs optimistic update on toggle", () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });

		expect(result.current.isLiked).toBe(true);
		expect(result.current.heartCount).toBe(11);
	});

	it("calls POST API when liking", async () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });

		await act(async () => { vi.advanceTimersByTime(300); });

		expect(mockFetch).toHaveBeenCalledWith("/api/kudos/k1/like", { method: "POST" });
	});

	it("calls DELETE API when unliking", async () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: true, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper([{ id: "k1", is_liked_by_me: true, heart_count: 10 }]) },
		);

		act(() => { result.current.toggle(); });

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/kudos/k1/like", { method: "DELETE" });
	});

	it("reverts on API error", async () => {
		mockFetch.mockResolvedValue({ ok: false });

		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });

		expect(result.current.isLiked).toBe(true);
		expect(result.current.heartCount).toBe(11);

		await act(async () => { vi.advanceTimersByTime(300); });

		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
	});

	it("is disabled when user is sender", () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: true }),
			{ wrapper: makeWrapper() },
		);

		expect(result.current.isDisabled).toBe(true);

		act(() => { result.current.toggle(); });

		expect(result.current.isLiked).toBe(false);
		expect(result.current.heartCount).toBe(10);
	});

	it("sets toastMessage on API error", async () => {
		mockFetch.mockResolvedValue({ ok: false });

		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });

		await act(async () => { vi.advanceTimersByTime(300); });

		expect(result.current.toastMessage).toBe("Không thể thực hiện thao tác. Vui lòng thử lại.");
	});

	it("toastMessage is null initially", () => {
		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);
		expect(result.current.toastMessage).toBeNull();
	});

	it("dismissToast clears toastMessage", async () => {
		mockFetch.mockResolvedValue({ ok: false });

		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });
		await act(async () => { vi.advanceTimersByTime(300); });

		expect(result.current.toastMessage).toBeTruthy();

		act(() => { result.current.dismissToast(); });

		expect(result.current.toastMessage).toBeNull();
	});

	it("reconciles heartCount from server response on successful like", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ kudo_id: "k1", heart_count: 99, tim_awarded: 1 }),
		});

		const { result } = renderHook(
			() => useHeartToggle({ kudosId: "k1", initialIsLiked: false, initialHeartCount: 10, isSender: false }),
			{ wrapper: makeWrapper() },
		);

		act(() => { result.current.toggle(); });

		await act(async () => { vi.advanceTimersByTime(300); });

		// Server returned heart_count: 99 — should reconcile
		expect(result.current.heartCount).toBe(99);
	});
});
