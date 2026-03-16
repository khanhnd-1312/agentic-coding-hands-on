interface SecretBoxButtonProps {
	label: string;
	unopenedCount: number;
	onClick: () => void;
}

export function SecretBoxButton({
	label,
	unopenedCount,
	onClick,
}: SecretBoxButtonProps) {
	const isDisabled = unopenedCount === 0;

	return (
		<button
			type="button"
			disabled={isDisabled}
			aria-disabled={isDisabled}
			onClick={isDisabled ? undefined : onClick}
			className={[
				"w-full px-6 py-3 rounded-full font-[family-name:var(--font-montserrat)] text-base font-bold text-gray-900 transition-colors duration-150 bg-[var(--klb-color-accent-gold)]",
				isDisabled
					? "opacity-50 cursor-not-allowed"
					: "cursor-pointer hover:brightness-95",
				"focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2",
			].join(" ")}
		>
			{label}
		</button>
	);
}
