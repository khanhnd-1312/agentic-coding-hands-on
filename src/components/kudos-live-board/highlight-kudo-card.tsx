"use client";

import Link from "next/link";
import { UserInfoBlock } from "./user-info-block";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";
import { Icon } from "@/components/ui/icon";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";
import type { Kudos } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface HighlightKudoCardProps {
	kudos: Kudos;
	currentUserId: string;
	lang?: LanguagePreference;
	onHashtagClick?: (hashtagId: string) => void;
}

function formatTimestamp(isoString: string): string {
	const date = new Date(isoString);
	const hours = String(date.getUTCHours()).padStart(2, "0");
	const minutes = String(date.getUTCMinutes()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	const year = date.getUTCFullYear();
	return `${hours}:${minutes} - ${month}/${day}/${year}`;
}

export function HighlightKudoCard({
	kudos,
	currentUserId,
	lang = "vi",
	onHashtagClick,
}: HighlightKudoCardProps) {
	const t = kudosLiveBoardDictionary[lang].highlight;
	const isSender = currentUserId === kudos.sender_id;

	return (
		<article className="bg-[var(--klb-color-bg-card)] rounded-lg p-6 flex flex-col gap-3 min-w-0">
			{/* Sender → Receiver */}
			<div className="flex items-center gap-3 flex-wrap">
				<UserInfoBlock user={kudos.sender} lang={lang} />
				<Icon
					name="arrow-right"
					size={16}
					className="text-[var(--klb-color-text-muted)] shrink-0"
				/>
				<UserInfoBlock user={kudos.receiver} lang={lang} />
			</div>

			{/* Timestamp */}
			<time className="text-sm text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)]">
				{formatTimestamp(kudos.created_at)}
			</time>

			{/* Content — 3-line truncation, clickable to detail */}
			<Link href={`/kudo/${kudos.id}`} className="block">
				<p className="text-base font-bold text-gray-900 font-[family-name:var(--font-montserrat)] leading-8 line-clamp-3">
					{kudos.content}
				</p>
			</Link>

			{/* Hashtags */}
			{kudos.hashtags.length > 0 && (
				<div className="flex gap-2 overflow-hidden max-h-6">
					{kudos.hashtags.map((tag) => (
						<button
							key={tag.id}
							type="button"
							onClick={() => onHashtagClick?.(tag.id)}
							className="text-sm font-bold text-[var(--klb-color-heart-red)] whitespace-nowrap cursor-pointer hover:underline focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded"
						>
							{tag.name}
						</button>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center justify-between pt-2 border-t border-gray-200">
				<HeartButton
					kudosId={kudos.id}
					initialIsLiked={kudos.is_liked_by_me}
					initialHeartCount={kudos.heart_count}
					isSender={isSender}
				/>
				<div className="flex items-center gap-4">
					<CopyLinkButton kudosId={kudos.id} lang={lang} />
					<Link
						href={`/kudo/${kudos.id}`}
						className="text-sm font-bold text-[var(--klb-color-heart-red)] hover:underline font-[family-name:var(--font-montserrat)] focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded"
					>
						{t.viewDetail}
					</Link>
				</div>
			</div>
		</article>
	);
}
