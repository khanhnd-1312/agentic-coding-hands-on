import { StatsPanel } from "./stats-panel";
import { SecretBoxButton } from "./secret-box-button";
import { TopSunnerList } from "./top-sunner-list";
import type { UserStats, TopGiftSunner } from "@/types/kudos";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

interface KudosSidebarProps {
	stats: UserStats;
	topGifts: TopGiftSunner[];
	dict: KudosLiveBoardDictionary;
	onOpenSecretBox: () => void;
}

export function KudosSidebar({
	stats,
	topGifts,
	dict,
	onOpenSecretBox,
}: KudosSidebarProps) {
	return (
		<aside className="sticky top-[100px] flex flex-col gap-8 max-h-[calc(100vh-120px)]">
			<StatsPanel
				stats={stats}
				labels={dict.sidebar}
			/>

			<SecretBoxButton
				label={dict.sidebar.openSecretBox}
				unopenedCount={stats.secret_boxes_unopened}
				onClick={onOpenSecretBox}
			/>

			<TopSunnerList
				title={dict.sidebar.topSunnerTitle}
				items={topGifts}
				emptyText={dict.sidebar.noData}
			/>
		</aside>
	);
}
