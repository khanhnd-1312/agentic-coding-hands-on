"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarCount } from "./star-count";
import type { LanguagePreference } from "@/types/login";

interface UserInfo {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
	kudos_received_count: number;
}

interface UserInfoBlockProps {
	user: UserInfo;
	lang?: LanguagePreference;
}

export function UserInfoBlock({ user, lang = "vi" }: UserInfoBlockProps) {
	const [imgError, setImgError] = useState(false);
	const initials = user.name.charAt(0).toUpperCase();
	const profileHref = `/profile/${user.id}`;

	return (
		<div className="flex items-center gap-3">
			{/* Avatar */}
			<Link href={profileHref} className="relative w-10 h-10 shrink-0 block rounded-full focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2">
				{user.avatar_url && !imgError ? (
					<Image
						src={user.avatar_url}
						alt={user.name}
						width={40}
						height={40}
						className="rounded-full object-cover w-10 h-10"
						onError={() => setImgError(true)}
					/>
				) : (
					<div className="w-10 h-10 rounded-full bg-[var(--klb-color-border-gold)] flex items-center justify-center text-white font-bold text-sm">
						{initials}
					</div>
				)}
			</Link>

			{/* Info */}
			<div className="flex flex-col min-w-0">
				<div className="flex items-center gap-1.5">
					<Link
						href={profileHref}
						className="font-bold text-sm text-gray-900 truncate hover:underline focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded"
					>
						{user.name}
					</Link>
					<StarCount
						kudosReceivedCount={user.kudos_received_count}
						lang={lang}
					/>
				</div>
				{user.department_name && (
					<span className="text-xs text-[var(--klb-color-text-muted)] truncate">
						{user.department_name}
					</span>
				)}
			</div>
		</div>
	);
}
