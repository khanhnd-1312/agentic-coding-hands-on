"use client";

import { Icon } from "@/components/ui/icon";

interface KudosSearchInputProps {
	placeholder: string;
	onClick: () => void;
}

export function KudosSearchInput({
	placeholder,
	onClick,
}: KudosSearchInputProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-3 w-full min-w-fit h-[72px] px-6 rounded-full border border-[var(--klb-color-border-gold)] bg-transparent hover:border-[var(--klb-color-accent-gold)] focus:border-[var(--klb-color-accent-gold)] focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 transition-colors duration-150 cursor-pointer"
		>
			<Icon name="pen" size={20} className="text-white shrink-0" />
			<input
				type="text"
				readOnly
				placeholder={placeholder}
				tabIndex={-1}
				className="flex-1 bg-transparent text-white font-[family-name:var(--font-montserrat)] text-base placeholder:text-white outline-none cursor-pointer pointer-events-none"
			/>
		</button>
	);
}
