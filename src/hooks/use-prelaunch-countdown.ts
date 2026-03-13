"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { calcTimeLeft } from "@/hooks/use-countdown";

interface PrelaunchCountdownResult {
	days: string;
	hours: string;
	minutes: string;
	isExpired: boolean;
}

interface UsePrelaunchCountdownParams {
	eventStartTime: string;
	serverTime: string;
}

const EXPIRED: PrelaunchCountdownResult = {
	days: "00",
	hours: "00",
	minutes: "00",
	isExpired: true,
};

export function usePrelaunchCountdown({
	eventStartTime,
	serverTime,
}: UsePrelaunchCountdownParams): PrelaunchCountdownResult {
	// Compute clock offset ONCE on mount: server-client delta
	const offsetRef = useRef(Date.parse(serverTime) - Date.now());

	const computeTimeLeft = useCallback((): PrelaunchCountdownResult => {
		const eventMs = Date.parse(eventStartTime);
		if (Number.isNaN(eventMs)) {
			return EXPIRED;
		}

		const correctedNow = Date.now() + offsetRef.current;
		const result = calcTimeLeft(new Date(eventMs), correctedNow);

		return {
			days: result.days,
			hours: result.hours,
			minutes: result.minutes,
			isExpired: result.isEventStarted,
		};
	}, [eventStartTime]);

	const [timeLeft, setTimeLeft] = useState<PrelaunchCountdownResult>(computeTimeLeft);

	useEffect(() => {
		const update = () => setTimeLeft(computeTimeLeft());

		const interval = setInterval(update, 1_000);

		const handleVisibility = () => {
			update();
		};
		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [computeTimeLeft]);

	return timeLeft;
}
