"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
	/** Fetch function that returns items for a given page */
	fetchPage: (page: number) => Promise<{ data: T[]; has_more: boolean }>;
	/** Initial data (from SSR) to avoid re-fetching page 1 */
	initialData?: T[];
	/** Whether initial data indicates more pages exist */
	initialHasMore?: boolean;
}

interface UseInfiniteScrollResult<T> {
	items: T[];
	isLoading: boolean;
	error: string | null;
	hasMore: boolean;
	sentinelRef: (node: HTMLElement | null) => void;
	reset: (newInitialData?: T[], newHasMore?: boolean) => void;
}

export function useInfiniteScroll<T>({
	fetchPage,
	initialData = [],
	initialHasMore = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
	const [items, setItems] = useState<T[]>(initialData);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const fetchingRef = useRef(false);

	const loadMore = useCallback(async () => {
		if (fetchingRef.current || !hasMore) return;
		fetchingRef.current = true;
		setIsLoading(true);
		setError(null);

		try {
			const nextPage = page + 1;
			const result = await fetchPage(nextPage);
			setItems((prev) => [...prev, ...result.data]);
			setPage(nextPage);
			setHasMore(result.has_more);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load more");
		} finally {
			setIsLoading(false);
			fetchingRef.current = false;
		}
	}, [fetchPage, hasMore, page]);

	const sentinelRef = useCallback(
		(node: HTMLElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			if (!node) return;

			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting) {
						loadMore();
					}
				},
				{ threshold: 0.1 },
			);
			observerRef.current.observe(node);
		},
		[loadMore],
	);

	const reset = useCallback(
		(newInitialData: T[] = [], newHasMore = true) => {
			setItems(newInitialData);
			setPage(1);
			setHasMore(newHasMore);
			setError(null);
			setIsLoading(false);
			fetchingRef.current = false;
		},
		[],
	);

	useEffect(() => {
		return () => {
			observerRef.current?.disconnect();
		};
	}, []);

	return { items, isLoading, error, hasMore, sentinelRef, reset };
}
