import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCountdown, DEFAULT_EVENT_DATE, calcTimeLeft } from "./use-countdown";

describe("calcTimeLeft", () => {
	it("returns correct days, hours, minutes with zero-padding", () => {
		// 1 day + 2 hours + 3 minutes ahead — capture now once to avoid race
		const now = Date.now();
		const target = new Date(
			now + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 3 * 60 * 1000
		);
		const result = calcTimeLeft(target, now);
		expect(result.days).toBe("01");
		expect(result.hours).toBe("02");
		expect(result.minutes).toBe("03");
		expect(result.isEventStarted).toBe(false);
	});

	it("zero-pads single digit days, hours, minutes", () => {
		const target = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
		const result = calcTimeLeft(target);
		expect(result.days).toBe("00");
		expect(result.hours).toBe("00");
		expect(result.minutes).toBe("05");
		expect(result.isEventStarted).toBe(false);
	});

	it("returns 00/00/00 and isEventStarted=true when target is in the past", () => {
		const past = new Date(Date.now() - 60 * 1000);
		const result = calcTimeLeft(past);
		expect(result.days).toBe("00");
		expect(result.hours).toBe("00");
		expect(result.minutes).toBe("00");
		expect(result.isEventStarted).toBe(true);
	});

	it("isEventStarted=true when now >= targetDate exactly", () => {
		const now = new Date();
		const result = calcTimeLeft(now);
		expect(result.isEventStarted).toBe(true);
	});

	it("handles large day counts correctly", () => {
		const target = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
		const result = calcTimeLeft(target);
		expect(result.days).toBe("100");
		expect(result.isEventStarted).toBe(false);
	});
});

describe("useCountdown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns initial time left on first render", () => {
		const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
		const { result } = renderHook(() => useCountdown(target));
		expect(result.current.days).toBe("02");
		expect(result.current.isEventStarted).toBe(false);
	});

	it("updates every 60 seconds via setInterval", () => {
		const target = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours ahead
		const { result } = renderHook(() => useCountdown(target));

		expect(result.current.minutes).toBe("00");

		// advance 1 minute — hook should re-read Date.now() and update
		act(() => {
			vi.advanceTimersByTime(60_000);
		});

		// After 1 minute passes, time left decreases from 120 min to 119 min
		expect(result.current.minutes).toBe("59");
	});

	it("clears interval on unmount (no act() warning)", () => {
		const target = new Date(Date.now() + 60 * 60 * 1000);
		const { unmount } = renderHook(() => useCountdown(target));
		expect(() => unmount()).not.toThrow();
	});

	it("uses DEFAULT_EVENT_DATE as fallback when no targetDate supplied", () => {
		// DEFAULT_EVENT_DATE is in the past relative to 2026 test environment
		const { result } = renderHook(() => useCountdown(undefined));
		// event is in the past → isEventStarted=true, all zeros
		expect(result.current.isEventStarted).toBe(true);
		expect(result.current.days).toBe("00");
	});
});
