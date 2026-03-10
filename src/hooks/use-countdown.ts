"use client";

import { useState, useEffect } from "react";

export const DEFAULT_EVENT_DATE = "2025-11-15T18:30:00+07:00";

interface TimeLeft {
	days: string;
	hours: string;
	minutes: string;
	isEventStarted: boolean;
}

function pad(n: number): string {
	return String(Math.max(0, n)).padStart(2, "0");
}

export function calcTimeLeft(targetDate: Date, nowMs: number = Date.now()): TimeLeft {
	const diff = targetDate.getTime() - nowMs;

	if (diff <= 0) {
		return { days: "00", hours: "00", minutes: "00", isEventStarted: true };
	}

	const totalMinutes = Math.floor(diff / 60_000);
	const minutes = totalMinutes % 60;
	const totalHours = Math.floor(totalMinutes / 60);
	const hours = totalHours % 24;
	const days = Math.floor(totalHours / 24);

	return {
		days: pad(days),
		hours: pad(hours),
		minutes: pad(minutes),
		isEventStarted: false,
	};
}

export function useCountdown(targetDate?: Date): TimeLeft {
	const resolvedTarget =
		targetDate ?? new Date(DEFAULT_EVENT_DATE);

	const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
		calcTimeLeft(resolvedTarget)
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calcTimeLeft(resolvedTarget));
		}, 60_000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedTarget.getTime()]);

	return timeLeft;
}
