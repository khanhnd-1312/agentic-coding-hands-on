interface PaginationIndicatorProps {
	current: number;
	total: number;
}

export function PaginationIndicator({
	current,
	total,
}: PaginationIndicatorProps) {
	return (
		<span className="text-[32px] font-bold text-white font-[family-name:var(--font-montserrat)]">
			{current}/{total}
		</span>
	);
}
