"use client";

import Link from "next/link";
import { UserInfoBlock } from "./user-info-block";
import { ImageGallery } from "./image-gallery";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";
import { Icon } from "@/components/ui/icon";
import { type Kudos, getContentNodes } from "@/types/kudos";
import type { LanguagePreference } from "@/types/login";

interface KudoPostCardProps {
	kudos: Kudos;
	currentUserId: string;
	lang?: LanguagePreference;
	onHashtagClick?: (hashtagId: string) => void;
}

function formatTimestamp(isoString: string): string {
	const date = new Date(isoString);
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const year = date.getFullYear();
	return `${hours}:${minutes} - ${month}/${day}/${year}`;
}

export function KudoPostCard({
	kudos,
	currentUserId,
	lang = "vi",
	onHashtagClick,
}: KudoPostCardProps) {
	const isSender = currentUserId === kudos.sender_id;

	return (
		<article className="bg-[var(--klb-color-bg-card)] rounded-lg p-6 flex flex-col gap-4">
			{/* Sender ▷ Receiver — vertical avatar layout */}
			<div className="flex items-start justify-center gap-6">
				{kudos.is_anonymous ? (
					<div className="flex flex-col items-center gap-2">
						<div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
							<Icon name="user-avatar" size={24} className="text-gray-500" />
						</div>
						<span className="text-sm font-bold font-[family-name:var(--font-montserrat)] text-gray-500">Ẩn danh</span>
					</div>
				) : (
					<UserInfoBlock user={kudos.sender} />
				)}
				<div className="pt-4">
					<Icon
						name="play-right"
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

			{/* Title / Danh hiệu + edit icon */}
			{kudos.title && (
				<div className="flex items-center justify-between">
					<span className="flex-1 text-center text-base font-bold text-gray-900 font-[family-name:var(--font-montserrat)] uppercase tracking-wide">
						{kudos.title}
					</span>
					<Icon name="pen" size={16} className="text-gray-500 shrink-0" />
				</div>
			)}

			{/* Content in lighter background box */}
			<Link href={`/kudo/${kudos.id}`} className="block">
				<div className="bg-[var(--klb-color-bg-card-alt)] rounded-lg p-4">
					<p className="text-xl font-bold text-gray-900 font-[family-name:var(--font-montserrat)] leading-8 line-clamp-5">
						{getContentNodes(kudos.content).map((node, i) =>
							node.type === "mention" ? (
								<span
									key={i}
									className="text-blue-600 font-bold"
								>
									{node.text}
								</span>
							) : (
								<span key={i}>{node.text}</span>
							),
						)}
					</p>
				</div>
			</Link>

			{/* Image gallery */}
			<ImageGallery images={kudos.images} />

			{/* Hashtags — 1-line truncation */}
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

			{/* Actions: Heart + Copy Link */}
			<div className="flex items-center justify-between pt-2">
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
