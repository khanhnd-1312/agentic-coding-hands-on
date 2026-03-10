"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export function WidgetButton() {
	// TODO(product): define quick-action menu items when product decides on actions
	function handleClick() {
		// Placeholder: no action defined yet
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="Hành động nhanh"
			className={[
				"fixed right-[19px] bottom-[130px] z-50",
				"w-[106px] h-16",
				"flex flex-row items-center justify-center gap-2",
				"bg-[#FFEA9E] rounded-full",
				"shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]",
				"p-4",
				"transition-[background-color,box-shadow,transform] duration-150 ease-in-out",
				"hover:bg-[#FFE480] hover:shadow-[0_6px_16px_rgba(250,226,135,0.5)]",
				"active:scale-[0.97]",
				"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
			].join(" ")}
		>
			{/* Left: pen/write icon */}
			<Icon name="pen" size={24} className="[&_path]:fill-[#00101A]" />
			{/* Separator */}
			<span className="text-[#00101A] text-base font-bold leading-none" aria-hidden="true">/</span>
			{/* Right: SAA logo (MM_MEDIA_Kudos Logo) */}
			<Image
				src="/images/homepage/saa-logo.svg"
				alt=""
				width={24}
				height={24}
				aria-hidden="true"
			/>
		</button>
	);
}
