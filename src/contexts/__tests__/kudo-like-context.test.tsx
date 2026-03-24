import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { KudoLikeProvider, useKudoLikeContext } from "../kudo-like-context";

const initialKudos = [
	{ id: "k1", is_liked_by_me: false, heart_count: 10 },
	{ id: "k2", is_liked_by_me: true, heart_count: 5 },
];

function wrapper({ children }: { children: ReactNode }) {
	return (
		<KudoLikeProvider initialKudos={initialKudos}>{children}</KudoLikeProvider>
	);
}

describe("KudoLikeContext", () => {
	it("initializes kudoLikeMap from initialKudos", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		expect(result.current.kudoLikeMap["k1"]).toEqual({
			isLiked: false,
			heartCount: 10,
		});
		expect(result.current.kudoLikeMap["k2"]).toEqual({
			isLiked: true,
			heartCount: 5,
		});
	});

	it("optimisticLike increments heartCount and sets isLiked to true", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		act(() => {
			result.current.optimisticLike("k1");
		});

		expect(result.current.kudoLikeMap["k1"]).toEqual({
			isLiked: true,
			heartCount: 11,
		});
	});

	it("optimisticUnlike decrements heartCount and sets isLiked to false", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		act(() => {
			result.current.optimisticUnlike("k2");
		});

		expect(result.current.kudoLikeMap["k2"]).toEqual({
			isLiked: false,
			heartCount: 4,
		});
	});

	it("reconcile updates heartCount to server value, preserves isLiked", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		act(() => {
			result.current.optimisticLike("k1");
		});
		act(() => {
			result.current.reconcile("k1", 15);
		});

		expect(result.current.kudoLikeMap["k1"].heartCount).toBe(15);
		expect(result.current.kudoLikeMap["k1"].isLiked).toBe(true);
	});

	it("rollback reverts isLiked and heartCount to previous values", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		act(() => {
			result.current.optimisticLike("k1");
		});
		act(() => {
			result.current.rollback("k1", false, 10);
		});

		expect(result.current.kudoLikeMap["k1"]).toEqual({
			isLiked: false,
			heartCount: 10,
		});
	});

	it("registerKudos adds new kudos without overwriting existing in-flight state", () => {
		const { result } = renderHook(() => useKudoLikeContext(), { wrapper });

		// Optimistically like k1
		act(() => {
			result.current.optimisticLike("k1");
		});
		expect(result.current.kudoLikeMap["k1"].isLiked).toBe(true);

		// Register k1 again (stale server data) and a new k3
		act(() => {
			result.current.registerKudos([
				{ id: "k1", is_liked_by_me: false, heart_count: 10 }, // stale — must NOT overwrite
				{ id: "k3", is_liked_by_me: false, heart_count: 3 },  // new entry
			]);
		});

		// k1 optimistic state preserved
		expect(result.current.kudoLikeMap["k1"].isLiked).toBe(true);
		// k3 added
		expect(result.current.kudoLikeMap["k3"]).toEqual({
			isLiked: false,
			heartCount: 3,
		});
	});

	it("throws if used outside KudoLikeProvider", () => {
		// Suppress React error boundary noise
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(() =>
			renderHook(() => useKudoLikeContext()),
		).toThrow();
		spy.mockRestore();
	});
});
