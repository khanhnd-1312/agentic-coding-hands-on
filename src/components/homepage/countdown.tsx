"use client";

import { useCountdown, DEFAULT_EVENT_DATE } from "@/hooks/use-countdown";
import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface CountdownTileProps {
	digits: string;
	label: string;
}

function DigitBox({ char }: { char: string }) {
	return (
		<span
			className={[
				"inline-flex items-center justify-center",
				"w-[51px] h-[82px]",
				"border-[0.5px] border-[#FFEA9E] rounded-lg",
				"bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0.10)_100%)]",
				"opacity-50 backdrop-blur-[16.64px]",
				"font-[var(--font-digital-numbers)] text-[49px] text-white leading-none",
			].join(" ")}
		>
			{char}
		</span>
	);
}

function CountdownTile({ digits, label }: CountdownTileProps) {
	const [d0, d1] = digits.padStart(2, "0").split("");
	return (
		<div className="flex flex-col items-center gap-[14px] w-[116px] h-[128px] justify-center">
			<div className="flex flex-row gap-[14px]">
				<DigitBox char={d0} />
				<DigitBox char={d1} />
			</div>
			<span className="text-white text-2xl font-bold leading-8">{label}</span>
		</div>
	);
}

interface CountdownProps {
	lang?: LanguagePreference;
}

export function Countdown({ lang = "vi" }: CountdownProps) {
	const eventDateEnv = process.env.NEXT_PUBLIC_EVENT_DATETIME;
	const targetDate = eventDateEnv
		? new Date(eventDateEnv)
		: new Date(DEFAULT_EVENT_DATE);

	const { days, hours, minutes, isEventStarted } = useCountdown(targetDate);
	const t = homepageDictionary[lang].countdown;

	return (
		<div
			aria-live="polite"
			aria-label="Đếm ngược đến sự kiện"
			className="flex flex-col gap-4 w-full max-w-[1224px]"
		>
			{!isEventStarted && (
				<span className="text-white text-2xl font-bold leading-8">
					{t.comingSoon}
				</span>
			)}
			<div className="flex flex-row gap-[40px]">
				<CountdownTile digits={days} label={t.days} />
				<CountdownTile digits={hours} label={t.hours} />
				<CountdownTile digits={minutes} label={t.minutes} />
			</div>
		</div>
	);
}
