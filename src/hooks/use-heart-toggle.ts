"use client";

import { useState, useRef, useCallback } from "react";
import { useKudoLikeContext } from "@/contexts/kudo-like-context";

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
	toastMessage: string | null;
	dismissToast: () => void;
}

const DEBOUNCE_MS = 300;

export function useHeartToggle({
	kudosId,
	initialIsLiked,
	initialHeartCount,
	isSender,
}: UseHeartToggleOptions): UseHeartToggleResult {
	const { kudoLikeMap, optimisticLike, optimisticUnlike, reconcile, rollback } =
		useKudoLikeContext();

	const [isLoading, setIsLoading] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const state = kudoLikeMap[kudosId] ?? {
		isLiked: initialIsLiked,
		heartCount: initialHeartCount,
	};
	const { isLiked, heartCount } = state;

	const dismissToast = useCallback(() => {
		setToastMessage(null);
	}, []);

	const toggle = useCallback(() => {
		if (isSender || isLoading) return;

		// Snapshot state before optimistic update (for rollback)
		const prevIsLiked = isLiked;
		const prevHeartCount = heartCount;

		// Clear pending debounce
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		// Optimistic update via context
		const willLike = !isLiked;
		if (willLike) {
			optimisticLike(kudosId);
		} else {
			optimisticUnlike(kudosId);
		}

		// Debounced API call
		debounceTimer.current = setTimeout(async () => {
			setIsLoading(true);
			try {
				const method = willLike ? "POST" : "DELETE";
				const res = await fetch(`/api/kudos/${kudosId}/like`, { method });
				if (!res.ok) {
					rollback(kudosId, prevIsLiked, prevHeartCount);
					setToastMessage("Không thể thực hiện thao tác. Vui lòng thử lại.");
				} else {
					const data = (await res.json()) as { heart_count?: number };
					if (typeof data.heart_count === "number") {
						reconcile(kudosId, data.heart_count);
					}
				}
			} catch {
				rollback(kudosId, prevIsLiked, prevHeartCount);
				setToastMessage("Không thể thực hiện thao tác. Vui lòng thử lại.");
			} finally {
				setIsLoading(false);
			}
		}, DEBOUNCE_MS);
	}, [kudosId, isLiked, heartCount, isSender, isLoading, optimisticLike, optimisticUnlike, reconcile, rollback]);

	return {
		isLiked,
		heartCount,
		isDisabled: isSender,
		isLoading,
		toggle,
		toastMessage,
		dismissToast,
	};
}
