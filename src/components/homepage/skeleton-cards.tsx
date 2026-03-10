export function SkeletonCards() {
	return (
		<div className="flex flex-wrap gap-[80px] max-md:gap-10 max-sm:gap-8">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="w-[336px] h-[504px] max-w-full rounded-3xl bg-[#2E3940] animate-pulse"
					aria-hidden="true"
				/>
			))}
		</div>
	);
}
