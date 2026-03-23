interface PaginationIndicatorProps {
	current: number;
	total: number;
}

export function PaginationIndicator({
	current,
	total,
}: PaginationIndicatorProps) {
	return (
		<span className="font-bold font-[family-name:var(--font-montserrat)] flex items-baseline">
			<span className="text-[32px] text-[var(--klb-color-accent-gold)]">
				{current}
			</span>
			<span className="text-[20px] text-[var(--klb-color-text-muted)]">
				/{total}
			</span>
		</span>
	);
}
