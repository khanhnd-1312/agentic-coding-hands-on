"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface KudoLikeState {
	isLiked: boolean;
	heartCount: number;
}

interface KudoLikeContextValue {
	kudoLikeMap: Record<string, KudoLikeState>;
	optimisticLike: (kudosId: string) => void;
	optimisticUnlike: (kudosId: string) => void;
	reconcile: (kudosId: string, heartCount: number) => void;
	rollback: (kudosId: string, isLiked: boolean, heartCount: number) => void;
	registerKudos: (kudos: { id: string; is_liked_by_me: boolean; heart_count: number }[]) => void;
}

const KudoLikeContext = createContext<KudoLikeContextValue | null>(null);

interface KudoLikeProviderProps {
	children: ReactNode;
	initialKudos: { id: string; is_liked_by_me: boolean; heart_count: number }[];
}

export function KudoLikeProvider({ children, initialKudos }: KudoLikeProviderProps) {
	const [kudoLikeMap, setKudoLikeMap] = useState<Record<string, KudoLikeState>>(() => {
		const map: Record<string, KudoLikeState> = {};
		for (const kudo of initialKudos) {
			map[kudo.id] = { isLiked: kudo.is_liked_by_me, heartCount: kudo.heart_count };
		}
		return map;
	});

	const optimisticLike = useCallback((kudosId: string) => {
		setKudoLikeMap((prev) => {
			const current = prev[kudosId];
			if (!current) return prev;
			return { ...prev, [kudosId]: { isLiked: true, heartCount: current.heartCount + 1 } };
		});
	}, []);

	const optimisticUnlike = useCallback((kudosId: string) => {
		setKudoLikeMap((prev) => {
			const current = prev[kudosId];
			if (!current) return prev;
			return { ...prev, [kudosId]: { isLiked: false, heartCount: current.heartCount - 1 } };
		});
	}, []);

	const reconcile = useCallback((kudosId: string, heartCount: number) => {
		setKudoLikeMap((prev) => {
			const current = prev[kudosId];
			if (!current) return prev;
			return { ...prev, [kudosId]: { isLiked: current.isLiked, heartCount } };
		});
	}, []);

	const rollback = useCallback((kudosId: string, isLiked: boolean, heartCount: number) => {
		setKudoLikeMap((prev) => ({
			...prev,
			[kudosId]: { isLiked, heartCount },
		}));
	}, []);

	const registerKudos = useCallback(
		(kudos: { id: string; is_liked_by_me: boolean; heart_count: number }[]) => {
			setKudoLikeMap((prev) => {
				const next = { ...prev };
				for (const kudo of kudos) {
					// Only register if not already tracked (preserves in-flight optimistic state)
					if (!(kudo.id in next)) {
						next[kudo.id] = { isLiked: kudo.is_liked_by_me, heartCount: kudo.heart_count };
					}
				}
				return next;
			});
		},
		[],
	);

	return (
		<KudoLikeContext.Provider
			value={{ kudoLikeMap, optimisticLike, optimisticUnlike, reconcile, rollback, registerKudos }}
		>
			{children}
		</KudoLikeContext.Provider>
	);
}

export function useKudoLikeContext(): KudoLikeContextValue {
	const ctx = useContext(KudoLikeContext);
	if (!ctx) {
		throw new Error("useKudoLikeContext must be used within a KudoLikeProvider");
	}
	return ctx;
}
