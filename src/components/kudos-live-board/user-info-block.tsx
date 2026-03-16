"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStarCount } from "@/types/kudos";

interface UserInfo {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
	kudos_received_count: number;
}

interface UserInfoBlockProps {
	user: UserInfo;
}

const HERO_BADGE: Record<number, { label: string; color: string }> = {
	1: { label: "New Hero", color: "bg-green-500" },
	2: { label: "Rising Hero", color: "bg-blue-500" },
	3: { label: "Legend Hero", color: "bg-amber-500" },
};

export function UserInfoBlock({ user }: UserInfoBlockProps) {
	const [imgError, setImgError] = useState(false);
	const initials = user.name.charAt(0).toUpperCase();
	const profileHref = `/profile/${user.id}`;
	const starLevel = getStarCount(user.kudos_received_count);
	const badge = HERO_BADGE[starLevel];

	return (
		<div className="flex flex-col items-center gap-1 min-w-0">
			{/* Avatar */}
			<Link
				href={profileHref}
				className="relative w-12 h-12 shrink-0 block rounded-full focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2"
			>
				{user.avatar_url && !imgError ? (
					<Image
						src={user.avatar_url}
						alt={user.name}
						width={48}
						height={48}
						className="rounded-full object-cover w-12 h-12"
						onError={() => setImgError(true)}
					/>
				) : (
					<div className="w-12 h-12 rounded-full bg-[var(--klb-color-border-gold)] flex items-center justify-center text-white font-bold text-base">
						{initials}
					</div>
				)}
			</Link>

			{/* Name */}
			<Link
				href={profileHref}
				className="font-bold text-sm text-gray-900 truncate max-w-[140px] hover:underline text-center focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2 rounded font-[family-name:var(--font-montserrat)]"
			>
				{user.name}
			</Link>

			{/* Dept code + Hero badge */}
			<div className="flex items-center gap-1.5">
				{user.department_name && (
					<span className="text-xs text-[var(--klb-color-text-muted)] font-[family-name:var(--font-montserrat)]">
						{user.department_name}
					</span>
				)}
				{badge && (
					<>
						<span className="text-xs text-[var(--klb-color-text-muted)]">·</span>
						<span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${badge.color} font-[family-name:var(--font-montserrat)]`}>
							{badge.label}
						</span>
					</>
				)}
			</div>
		</div>
	);
}
