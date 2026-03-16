import { TopSunnerListItem } from "./top-sunner-list-item";
import type { TopGiftSunner } from "@/types/kudos";

interface TopSunnerListProps {
	title: string;
	items: TopGiftSunner[];
	emptyText: string;
}

export function TopSunnerList({ title, items, emptyText }: TopSunnerListProps) {
	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-[22px] font-bold text-[var(--klb-color-accent-gold)] font-[family-name:var(--font-montserrat)]">
				{title}
			</h3>

			{items.length === 0 ? (
				<p className="text-sm text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)]">
					{emptyText}
				</p>
			) : (
				<ul className="flex flex-col gap-3">
					{items.map((item, index) => (
						<li key={`${item.user_id}-${index}`}>
							<TopSunnerListItem item={item} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
