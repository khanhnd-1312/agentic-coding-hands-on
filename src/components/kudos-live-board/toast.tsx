"use client";

import { useEffect } from "react";

interface ToastProps {
	message: string | null;
	onDismiss: () => void;
	/** Auto-dismiss after N ms. Default: 3000 */
	duration?: number;
}

export function Toast({ message, onDismiss, duration = 3000 }: ToastProps) {
	useEffect(() => {
		if (!message) return;
		const timer = setTimeout(onDismiss, duration);
		return () => clearTimeout(timer);
	}, [message, onDismiss, duration]);

	if (!message) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed bottom-4 right-4 z-50 bg-white/90 text-gray-900 rounded-lg px-4 py-3 shadow-lg text-sm font-medium animate-[fadeIn_200ms_ease-out]"
		>
			{message}
		</div>
	);
}
