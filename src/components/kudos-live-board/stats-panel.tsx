import type { UserStats } from "@/types/kudos";

interface StatsPanelLabels {
	kudosReceived: string;
	kudosSent: string;
	heartsReceived: string;
	secretBoxOpened: string;
	secretBoxUnopened: string;
}

interface StatsPanelProps {
	stats: UserStats;
	labels: StatsPanelLabels;
}

function StatRow({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex items-center justify-between py-2">
			<span className="text-base lg:text-[22px] font-bold text-white font-[family-name:var(--font-montserrat)]">
				{label}
			</span>
			<span className="text-base lg:text-[22px] font-bold text-white font-[family-name:var(--font-montserrat)]">
				{value}
			</span>
		</div>
	);
}

export function StatsPanel({ stats, labels }: StatsPanelProps) {
	return (
		<div className="flex flex-col">
			<StatRow label={labels.kudosReceived} value={stats.kudos_received} />
			<StatRow label={labels.kudosSent} value={stats.kudos_sent} />
			<StatRow label={labels.heartsReceived} value={stats.hearts_received} />

			{/* Separator */}
			<div
				role="separator"
				className="h-px bg-[var(--klb-color-separator)] my-3"
			/>

			<StatRow
				label={labels.secretBoxOpened}
				value={stats.secret_boxes_opened}
			/>
			<StatRow
				label={labels.secretBoxUnopened}
				value={stats.secret_boxes_unopened}
			/>
		</div>
	);
}
