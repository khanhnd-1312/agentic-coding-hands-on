"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePrelaunchCountdown } from "@/hooks/use-prelaunch-countdown";
import { countdownPrelaunchDictionary } from "@/i18n/countdown-prelaunch";
import { PrelaunchTimer } from "./prelaunch-timer";
import type { PrelaunchCountdownProps } from "@/types/countdown";

export function CountdownPrelaunchPage({
	eventStartTime,
	serverTime,
}: PrelaunchCountdownProps) {
	const router = useRouter();
	const { days, hours, minutes, isExpired } = usePrelaunchCountdown({
		eventStartTime,
		serverTime,
	});

	useEffect(() => {
		if (isExpired) {
			router.push("/login");
		}
	}, [isExpired, router]);

	const t = countdownPrelaunchDictionary.vi;

	return (
		<main className="relative w-full min-h-screen bg-[var(--prelaunch-bg)] overflow-hidden">
			{/* Background image — z-0 */}
			<Image
				src="/images/countdown/bg-prelaunch.png"
				alt=""
				aria-hidden="true"
				fill
				className="object-cover object-center z-0"
				priority
				sizes="100vw"
			/>

			{/* Gradient overlay — z-10 */}
			<div
				data-testid="gradient-overlay"
				className="absolute inset-0 z-10"
				style={{
					background:
						"linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0) 63.41%)",
				}}
			/>

			{/* Content — z-20 */}
			<div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-[144px] max-lg:px-12 max-md:px-4 py-24 max-lg:py-12 max-md:py-6 gap-6">
				<h1 className="text-white text-4xl max-lg:text-[28px] max-lg:leading-9 max-md:text-xl max-md:leading-7 font-bold italic leading-12 text-center font-(family-name:--font-montserrat)">
					{t.heading}
				</h1>
				<PrelaunchTimer days={days} hours={hours} minutes={minutes} />
			</div>
		</main>
	);
}
