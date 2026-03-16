import Link from "next/link";
import Image from "next/image";
import type { TopGiftSunner } from "@/types/kudos";

interface TopSunnerListItemProps {
	item: TopGiftSunner;
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return name.slice(0, 2).toUpperCase();
}

export function TopSunnerListItem({ item }: TopSunnerListItemProps) {
	return (
		<Link
			href={`/profile/${item.user_id}`}
			className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150"
		>
			{/* Red dot indicator */}
			<span className="w-2 h-2 rounded-full bg-[var(--klb-color-heart-red)] shrink-0" />

			{/* Avatar */}
			<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[var(--klb-color-border-gold)] flex items-center justify-center">
				{item.avatar_url ? (
					<Image
						src={item.avatar_url}
						alt={item.name}
						width={40}
						height={40}
						className="object-cover w-full h-full"
					/>
				) : (
					<span className="text-xs font-bold text-white font-[family-name:var(--font-montserrat)]">
						{getInitials(item.name)}
					</span>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-col min-w-0">
				<span className="text-sm font-bold text-white font-[family-name:var(--font-montserrat)] truncate">
					{item.name}
				</span>
				<span className="text-sm font-normal text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)] truncate">
					{item.gift_description}
				</span>
			</div>
		</Link>
	);
}
