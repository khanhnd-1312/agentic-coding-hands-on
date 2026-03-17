"use client";

import { useState, useCallback } from "react";
import type { CreateKudo } from "@/types/kudos";

interface UseCreateKudoReturn {
	submit: (data: CreateKudo) => Promise<boolean>;
	isSubmitting: boolean;
	error: string | null;
}

export function useCreateKudo(onSuccess?: () => void): UseCreateKudoReturn {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = useCallback(
		async (data: CreateKudo): Promise<boolean> => {
			setIsSubmitting(true);
			setError(null);

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch("/api/kudos", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					const body = (await response.json().catch(() => ({}))) as { error?: string };
					setError(
						body.error ?? `Lỗi ${response.status}: Không thể gửi kudo`,
					);
					return false;
				}

				onSuccess?.();
				return true;
			} catch (err) {
				clearTimeout(timeoutId);
				if (err instanceof DOMException && err.name === "AbortError") {
					setError("Kết nối quá chậm. Vui lòng thử lại.");
				} else {
					setError("Đã xảy ra lỗi. Vui lòng thử lại.");
				}
				return false;
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSuccess],
	);

	return { submit, isSubmitting, error };
}
