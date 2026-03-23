"use client";

import { useHeartToggle } from "@/hooks/use-heart-toggle";
import { Icon } from "@/components/ui/icon";

interface HeartButtonProps {
	kudosId: string;
	initialIsLiked: boolean;
	initialHeartCount: number;
	isSender: boolean;
}

export function HeartButton({
	kudosId,
	initialIsLiked,
	initialHeartCount,
	isSender,
}: HeartButtonProps) {
	const { isLiked, heartCount, isDisabled, isLoading, toggle } =
		useHeartToggle({
			kudosId,
			initialIsLiked,
			initialHeartCount,
			isSender,
		});

	return (
		<button
			type="button"
			onClick={toggle}
			aria-pressed={isLiked}
			aria-disabled={isDisabled}
			aria-label={isLiked ? "Unlike kudos" : "Like kudos"}
			className={[
				"flex items-center gap-1 transition-all duration-200 focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded",
				isDisabled
					? "opacity-30 cursor-not-allowed"
					: "cursor-pointer hover:scale-105",
				isLoading ? "pointer-events-none opacity-70" : "",
			].join(" ")}
		>
			<span className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-montserrat)]">
				{heartCount.toLocaleString("vi-VN")}
			</span>
			<Icon
				name="heart-filled"
				size={24}
				className={
					isLiked
						? "text-[var(--klb-color-heart-red)]"
						: "text-[var(--klb-color-text-muted)]"
				}
			/>
		</button>
	);
}
