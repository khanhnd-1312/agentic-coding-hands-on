"use client";

import { useState, useCallback, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import type { LanguagePreference } from "@/types/login";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface CopyLinkButtonProps {
	kudosId: string;
	lang?: LanguagePreference;
}

export function CopyLinkButton({ kudosId, lang = "vi" }: CopyLinkButtonProps) {
	const t = kudosLiveBoardDictionary[lang].allKudos;
	const [showToast, setShowToast] = useState(false);

	const handleCopy = useCallback(async () => {
		const url = `${window.location.origin}/kudo/${kudosId}`;
		await navigator.clipboard.writeText(url);
		setShowToast(true);
	}, [kudosId]);

	useEffect(() => {
		if (!showToast) return;
		const timer = setTimeout(() => setShowToast(false), 2500);
		return () => clearTimeout(timer);
	}, [showToast]);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={handleCopy}
				className="flex items-center gap-1 text-sm font-bold text-gray-900 cursor-pointer hover:opacity-80 hover:underline transition-opacity duration-200 focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2"
			>
				<Icon name="copy" size={16} className="text-gray-900" />
				<span>{t.copyLink}</span>
			</button>
			{showToast && (
				<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--klb-color-bg-card)] text-gray-900 text-xs font-medium rounded-md shadow-lg whitespace-nowrap">
					{t.linkCopied}
				</div>
			)}
		</div>
	);
}
