interface PrelaunchDigitCardProps {
	digit: string;
}

function PrelaunchDigitCard({ digit }: PrelaunchDigitCardProps) {
	return (
		<div
			data-testid="digit-card"
			className="relative w-[77px] h-[123px] max-lg:w-[60px] max-lg:h-[96px] max-md:w-[48px] max-md:h-[77px] flex items-center justify-center"
		>
			{/* Glassmorphism background — opacity applies ONLY to this layer */}
			<div
				className="absolute inset-0 rounded-xl opacity-50"
				style={{
					border: "0.75px solid #FFEA9E",
					background:
						"linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)",
					backdropFilter: "blur(24.96px)",
					WebkitBackdropFilter: "blur(24.96px)",
				}}
			/>
			{/* Digit text — full opacity, above background */}
			<span
				className="relative z-10 text-white text-center leading-none text-[73.73px] max-lg:text-[56px] max-md:text-[46px] motion-safe:transition-opacity motion-safe:duration-300"
				style={{
					fontFamily: "var(--font-digital-numbers), monospace",
				}}
			>
				{digit}
			</span>
		</div>
	);
}

interface PrelaunchTimeUnitProps {
	digits: string;
	label: string;
}

function PrelaunchTimeUnit({ digits, label }: PrelaunchTimeUnitProps) {
	// Cap at 99 to fit 2-digit card layout
	const capped = String(Math.min(parseInt(digits, 10) || 0, 99)).padStart(2, "0");
	const [d0, d1] = capped.split("");
	return (
		<div className="flex flex-col items-start gap-[21px] max-md:gap-3">
			<div className="flex flex-row items-center gap-[21px] max-md:gap-3">
				<PrelaunchDigitCard digit={d0} />
				<PrelaunchDigitCard digit={d1} />
			</div>
			<span className="text-white text-4xl max-lg:text-2xl max-md:text-lg font-bold leading-12 max-lg:leading-8 max-md:leading-6 font-(family-name:--font-montserrat)">
				{label}
			</span>
		</div>
	);
}

interface PrelaunchTimerProps {
	days: string;
	hours: string;
	minutes: string;
}

export function PrelaunchTimer({ days, hours, minutes }: PrelaunchTimerProps) {
	const daysNum = parseInt(days, 10) || 0;
	const hoursNum = parseInt(hours, 10) || 0;
	const minutesNum = parseInt(minutes, 10) || 0;

	return (
		<div
			role="timer"
			aria-live="polite"
			aria-atomic="true"
		>
			<span className="sr-only">
				Countdown: {daysNum} days, {hoursNum} hours, {minutesNum} minutes remaining
			</span>
			<div className="flex flex-row items-center gap-[60px] max-lg:gap-10 max-md:gap-6">
				<PrelaunchTimeUnit digits={days} label="DAYS" />
				<PrelaunchTimeUnit digits={hours} label="HOURS" />
				<PrelaunchTimeUnit digits={minutes} label="MINUTES" />
			</div>
		</div>
	);
}
