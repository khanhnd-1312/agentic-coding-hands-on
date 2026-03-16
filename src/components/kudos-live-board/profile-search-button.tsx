"use client";

import { Icon } from "@/components/ui/icon";

interface ProfileSearchButtonProps {
	label: string;
}

export function ProfileSearchButton({ label }: ProfileSearchButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			className="flex items-center gap-3 h-[72px] px-6 rounded-full border border-[var(--klb-color-border-gold)] bg-transparent text-white font-[family-name:var(--font-montserrat)] text-base font-bold hover:border-[var(--klb-color-accent-gold)] focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 transition-colors duration-150 cursor-pointer shrink-0"
		>
			<Icon name="search" size={20} className="text-white" />
			<span className="whitespace-nowrap">{label}</span>
		</button>
	);
}
