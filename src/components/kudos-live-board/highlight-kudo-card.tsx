"use client";

import Link from "next/link";
import { UserInfoBlock } from "./user-info-block";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";
import { Icon } from "@/components/ui/icon";
import { kudosLiveBoardDictionary } from "@/i18n/kudos-live-board";
import { type Kudos, getContentText } from "@/types/kudos";
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

	// First hashtag used as category label (D.4 — e.g., "IDOL GIỚI TRẺ")
	const categoryLabel = kudos.hashtags.length > 0 ? kudos.hashtags[0] : null;
	const remainingHashtags = kudos.hashtags.slice(1);

	return (
		<article className="bg-[var(--klb-color-bg-card)] rounded-lg p-5 flex flex-col gap-3 min-w-0">
			{/* Sender ▷ Receiver — vertical avatar layout */}
			<div className="flex items-start justify-center gap-4">
				{kudos.is_anonymous ? (
					<div className="flex flex-col items-center gap-2">
						<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
							<Icon name="user-avatar" size={20} className="text-gray-500" />
						</div>
						<span className="text-xs font-bold font-[family-name:var(--font-montserrat)] text-gray-500">Ẩn danh</span>
					</div>
				) : (
					<UserInfoBlock user={kudos.sender} />
				)}
				<div className="pt-4">
					<Icon
						name="play-right"
						size={18}
						className="text-[var(--klb-color-text-muted)]"
					/>
				</div>
				<UserInfoBlock user={kudos.receiver} />
			</div>

			{/* Title (Danh hiệu) */}
			{kudos.title && (
				<p className="text-sm font-bold text-[#FFEA9E] font-[family-name:var(--font-montserrat)] text-center">
					{kudos.title}
				</p>
			)}

			{/* Timestamp */}
			<time className="text-sm text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)]">
				{formatTimestamp(kudos.created_at)}
			</time>

			{/* Category label centered */}
			{categoryLabel && (
				<p className="text-sm font-bold text-gray-900 font-[family-name:var(--font-montserrat)] uppercase tracking-wide text-center">
					{categoryLabel.name.replace(/^#/, "")}
				</p>
			)}

			{/* Content — 3-line truncation in lighter bg box */}
			<Link href={`/kudo/${kudos.id}`} className="block">
				<div className="bg-[var(--klb-color-bg-card-alt)] rounded-lg p-3">
					<p className="text-base font-bold text-gray-900 font-[family-name:var(--font-montserrat)] leading-7 line-clamp-3">
						{getContentText(kudos.content)}
					</p>
				</div>
			</Link>

			{/* Hashtags */}
			{remainingHashtags.length > 0 && (
				<div className="flex gap-2 overflow-hidden max-h-6">
					{remainingHashtags.map((tag) => (
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
						className="text-sm font-bold text-gray-900 hover:underline font-[family-name:var(--font-montserrat)] focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded flex items-center gap-1"
					>
						{t.viewDetail}
						<Icon name="arrow-up" size={14} className="text-current" />
					</Link>
				</div>
			</div>
		</article>
	);
}
