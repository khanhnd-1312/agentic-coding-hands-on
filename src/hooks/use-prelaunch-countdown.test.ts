import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePrelaunchCountdown } from "./use-prelaunch-countdown";

describe("usePrelaunchCountdown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns days, hours, minutes, and isExpired from server-driven time", () => {
		// Event is 1 day + 2 hours + 30 minutes from serverTime
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-02T12:30:00Z";
		// Set Date.now() to match serverTime
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.days).toBe("01");
		expect(result.current.hours).toBe("02");
		expect(result.current.minutes).toBe("30");
		expect(result.current.isExpired).toBe(false);
	});

	it("ticks every 1 second", () => {
		// Event is exactly 2 minutes from serverTime
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-01T10:02:00Z";
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.minutes).toBe("02");

		// Advance 61 seconds — should tick and show 00 minutes (less than 1 min left)
		act(() => {
			vi.advanceTimersByTime(61_000);
		});

		expect(result.current.minutes).toBe("00");
	});

	it("computes offset between serverTime and client clock", () => {
		// Server says it's 10:00, but client clock is 09:55 (5 min behind)
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-01T11:00:00Z";
		// Client clock is 5 minutes behind server
		vi.setSystemTime(new Date("2026-04-01T09:55:00Z"));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		// Should use server-based offset: event is 1 hour from serverTime
		expect(result.current.hours).toBe("01");
		expect(result.current.minutes).toBe("00");
	});

	it("sets isExpired to true when remaining time reaches zero", () => {
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-01T10:00:03Z"; // 3 seconds from now
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.isExpired).toBe(false);

		// Advance past the event start time
		act(() => {
			vi.advanceTimersByTime(4_000);
		});

		expect(result.current.isExpired).toBe(true);
		expect(result.current.days).toBe("00");
		expect(result.current.hours).toBe("00");
		expect(result.current.minutes).toBe("00");
	});

	it("returns isExpired=true for invalid eventStartTime", () => {
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "not-a-date";
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.isExpired).toBe(true);
	});

	it("returns isExpired=true when event is already in the past", () => {
		const serverTime = "2026-04-01T12:00:00Z";
		const eventStartTime = "2026-04-01T10:00:00Z"; // 2 hours ago
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.isExpired).toBe(true);
	});

	it("re-syncs on visibilitychange event", () => {
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-01T12:00:00Z"; // 2 hours
		vi.setSystemTime(new Date(serverTime));

		const { result } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(result.current.hours).toBe("02");
		expect(result.current.minutes).toBe("00");

		// Simulate 30 minutes passing while tab was in background
		act(() => {
			vi.advanceTimersByTime(30 * 60 * 1000);
		});

		// Simulate tab returning to foreground
		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(result.current.hours).toBe("01");
		expect(result.current.minutes).toBe("30");
	});

	it("cleans up interval and event listener on unmount", () => {
		const serverTime = "2026-04-01T10:00:00Z";
		const eventStartTime = "2026-04-01T12:00:00Z";
		vi.setSystemTime(new Date(serverTime));

		const removeListenerSpy = vi.spyOn(document, "removeEventListener");

		const { unmount } = renderHook(() =>
			usePrelaunchCountdown({ eventStartTime, serverTime }),
		);

		expect(() => unmount()).not.toThrow();
		expect(removeListenerSpy).toHaveBeenCalledWith(
			"visibilitychange",
			expect.any(Function),
		);

		removeListenerSpy.mockRestore();
	});
});
