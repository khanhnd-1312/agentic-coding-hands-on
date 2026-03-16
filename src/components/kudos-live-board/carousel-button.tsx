"use client";

import { Icon } from "@/components/ui/icon";

interface CarouselButtonProps {
	direction: "prev" | "next";
	onClick: () => void;
	disabled: boolean;
}

export function CarouselButton({
	direction,
	onClick,
	disabled,
}: CarouselButtonProps) {
	return (
		<button
			type="button"
			onClick={disabled ? undefined : onClick}
			aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
			aria-disabled={disabled}
			className={[
				"w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0",
				disabled
					? "opacity-30 cursor-not-allowed"
					: "cursor-pointer hover:opacity-80 hover:scale-105",
				"focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2",
			].join(" ")}
		>
			<Icon
				name={direction === "prev" ? "chevron-left" : "chevron-right"}
				size={24}
				className="text-white"
			/>
		</button>
	);
}
