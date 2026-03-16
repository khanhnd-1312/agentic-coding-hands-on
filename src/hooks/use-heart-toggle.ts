"use client";

import { useState, useRef, useCallback } from "react";

interface UseHeartToggleOptions {
	kudosId: string;
	initialIsLiked: boolean;
	initialHeartCount: number;
	/** Whether the current user is the sender (cannot like own kudos) */
	isSender: boolean;
}

interface UseHeartToggleResult {
	isLiked: boolean;
	heartCount: number;
	isDisabled: boolean;
	isLoading: boolean;
	toggle: () => void;
}

const DEBOUNCE_MS = 300;

export function useHeartToggle({
	kudosId,
	initialIsLiked,
	initialHeartCount,
	isSender,
}: UseHeartToggleOptions): UseHeartToggleResult {
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [heartCount, setHeartCount] = useState(initialHeartCount);
	const [isLoading, setIsLoading] = useState(false);
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const toggle = useCallback(() => {
		if (isSender || isLoading) return;

		// Clear pending debounce
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		// Optimistic update
		const newIsLiked = !isLiked;
		const newCount = newIsLiked ? heartCount + 1 : heartCount - 1;
		setIsLiked(newIsLiked);
		setHeartCount(newCount);

		// Debounced API call
		debounceTimer.current = setTimeout(async () => {
			setIsLoading(true);
			try {
				const method = newIsLiked ? "POST" : "DELETE";
				const res = await fetch(`/api/kudos/${kudosId}/like`, { method });
				if (!res.ok) {
					// Revert on error
					setIsLiked(isLiked);
					setHeartCount(heartCount);
				}
			} catch {
				// Revert on error
				setIsLiked(isLiked);
				setHeartCount(heartCount);
			} finally {
				setIsLoading(false);
			}
		}, DEBOUNCE_MS);
	}, [kudosId, isLiked, heartCount, isSender, isLoading]);

	return {
		isLiked,
		heartCount,
		isDisabled: isSender,
		isLoading,
		toggle,
	};
}
