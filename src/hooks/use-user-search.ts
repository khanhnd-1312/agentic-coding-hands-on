"use client";

import { useState, useEffect, useRef } from "react";

interface UserSearchResult {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
}

interface UseUserSearchReturn {
	query: string;
	setQuery: (q: string) => void;
	results: UserSearchResult[];
	isLoading: boolean;
}

export function useUserSearch(): UseUserSearchReturn {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<UserSearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (query.trim().length === 0) {
			setResults([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		const timeoutId = setTimeout(async () => {
			// Cancel previous request
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			try {
				const response = await fetch(
					`/api/users/search?q=${encodeURIComponent(query.trim())}`,
					{ signal: controller.signal },
				);

				if (!response.ok) {
					setResults([]);
					return;
				}

				const body = (await response.json()) as { data?: UserSearchResult[] };
				setResults(body.data ?? []);
			} catch {
				// Aborted or network error — ignore
				if (!controller.signal.aborted) {
					setResults([]);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		}, 300); // 300ms debounce per spec TR-005

		return () => {
			clearTimeout(timeoutId);
		};
	}, [query]);

	return { query, setQuery, results, isLoading };
}
