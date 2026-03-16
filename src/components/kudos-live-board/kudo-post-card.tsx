"use client";

import Link from "next/link";
import { UserInfoBlock } from "./user-info-block";
import { ImageGallery } from "./image-gallery";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";
import { Icon } from "@/components/ui/icon";
import type { Kudos } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface KudoPostCardProps {
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

export function KudoPostCard({
	kudos,
	currentUserId,
	lang = "vi",
	onHashtagClick,
}: KudoPostCardProps) {
	const isSender = currentUserId === kudos.sender_id;

	// First hashtag used as category label (D.4 in spec — e.g., "IDOL GIỚI TRẺ")
	const categoryLabel = kudos.hashtags.length > 0 ? kudos.hashtags[0] : null;
	const remainingHashtags = kudos.hashtags.slice(1);

	return (
		<article className="bg-[var(--klb-color-bg-card)] rounded-lg p-6 flex flex-col gap-4">
			{/* Sender ▷ Receiver — vertical avatar layout */}
			<div className="flex items-start justify-center gap-6">
				<UserInfoBlock user={kudos.sender} />
				<div className="pt-4">
					<Icon
						name="arrow-right"
						size={20}
						className="text-[var(--klb-color-text-muted)]"
					/>
				</div>
				<UserInfoBlock user={kudos.receiver} />
			</div>

			{/* Timestamp */}
			<time className="text-sm text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)]">
				{formatTimestamp(kudos.created_at)}
			</time>

			{/* Category label + edit icon */}
			{categoryLabel && (
				<div className="flex items-center justify-center gap-3">
					<span className="text-base font-bold text-gray-900 font-[family-name:var(--font-montserrat)] uppercase tracking-wide">
						{categoryLabel.name.replace(/^#/, "")}
					</span>
					<Icon name="pen" size={16} className="text-gray-500" />
				</div>
			)}

			{/* Content in lighter background box */}
			<Link href={`/kudo/${kudos.id}`} className="block">
				<div className="bg-[var(--klb-color-bg-card-alt)] rounded-lg p-4">
					<p className="text-xl font-bold text-gray-900 font-[family-name:var(--font-montserrat)] leading-8 line-clamp-5">
						{kudos.content}
					</p>
				</div>
			</Link>

			{/* Image gallery */}
			<ImageGallery images={kudos.images} />

			{/* Hashtags — 1-line truncation */}
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

			{/* Actions: Heart + Copy Link */}
			<div className="flex items-center justify-between pt-2 border-t border-gray-200">
				<HeartButton
					kudosId={kudos.id}
					initialIsLiked={kudos.is_liked_by_me}
					initialHeartCount={kudos.heart_count}
					isSender={isSender}
				/>
				<CopyLinkButton kudosId={kudos.id} lang={lang} />
			</div>
		</article>
	);
}
