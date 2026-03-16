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
			className="flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--klb-color-border-gold)] bg-transparent text-white font-[family-name:var(--font-montserrat)] text-base font-bold hover:border-[var(--klb-color-accent-gold)] focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 transition-colors duration-150 cursor-pointer"
		>
			<Icon name="search" size={20} className="text-white" />
			<span>{label}</span>
		</button>
	);
}
