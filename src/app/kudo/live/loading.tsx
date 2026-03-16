export default function KudoLiveLoading() {
	return (
		<main className="min-h-screen bg-[var(--klb-color-bg-primary)] animate-pulse">
			{/* Hero skeleton */}
			<div className="w-full h-[512px] bg-[var(--klb-color-separator)]" />

			{/* Content skeleton */}
			<div className="px-4 xl:px-[var(--klb-spacing-page-x)] py-24 flex flex-col gap-[var(--klb-spacing-section-gap)]">
				{/* Highlight section skeleton */}
				<section className="flex flex-col gap-10">
					<div className="h-8 w-64 bg-[var(--klb-color-separator)] rounded" />
					<div className="h-12 w-96 bg-[var(--klb-color-separator)] rounded" />
					<div className="flex gap-6 overflow-hidden">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="shrink-0 w-80 h-96 bg-[var(--klb-color-separator)] rounded-lg"
							/>
						))}
					</div>
				</section>

				{/* Spotlight skeleton */}
				<section className="flex flex-col gap-10">
					<div className="h-8 w-64 bg-[var(--klb-color-separator)] rounded" />
					<div className="h-[548px] bg-[var(--klb-color-separator)] rounded-lg border border-[var(--klb-color-border-gold)]" />
				</section>

				{/* All Kudos skeleton */}
				<section className="flex flex-col gap-10">
					<div className="h-8 w-48 bg-[var(--klb-color-separator)] rounded" />
					<div className="flex flex-col lg:flex-row gap-[var(--klb-spacing-sidebar-gap)]">
						<div className="flex-1 flex flex-col gap-6">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className="h-64 bg-[var(--klb-color-separator)] rounded-lg"
								/>
							))}
						</div>
						<div className="w-full lg:w-[300px] flex flex-col gap-6">
							<div className="h-80 bg-[var(--klb-color-separator)] rounded-lg" />
							<div className="h-64 bg-[var(--klb-color-separator)] rounded-lg" />
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
