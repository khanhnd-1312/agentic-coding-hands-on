"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { Icon } from "@/components/ui/icon";
import type { LanguagePreference } from "@/types/login";

interface LoginButtonProps {
	lang: LanguagePreference;
	error?: string;
	onError: (msg: string | null) => void;
}

const ARIA_LABELS: Record<LanguagePreference, string> = {
	vi: "Đăng nhập bằng Google",
	en: "Sign in with Google",
};

export function LoginButton({ lang, error, onError }: LoginButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleClick() {
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

		setIsLoading(true);
		onError(null);

		const supabase = createClient();
		const { error: oauthError } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${siteUrl}/auth/callback` },
		});

		if (oauthError) {
			onError(oauthError.message);
			setIsLoading(false);
		}
	}

	return (
		<div>
			<button
				type="button"
				onClick={handleClick}
				disabled={isLoading}
				aria-label={ARIA_LABELS[lang]}
				aria-busy={isLoading ? "true" : undefined}
				aria-disabled={isLoading ? "true" : undefined}
				className={[
					"w-[305px] h-[60px] flex items-center gap-2 py-4 px-6",
					"bg-[#FFEA9E] rounded-lg cursor-pointer",
					"font-[var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]",
					"transition-[background-color,box-shadow] duration-150 ease-in-out",
					"hover:bg-[#FFE480] hover:shadow-[0_4px_12px_rgba(255,234,158,0.4)]",
					"active:scale-[0.98] active:transition-transform active:duration-100 active:ease-in active:bg-[#FFD740]",
					"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
					isLoading ? "opacity-70 cursor-not-allowed" : "",
					"md:w-[280px] lg:w-[305px] max-md:w-full",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{isLoading ? (
					<>
						<span className="w-[225px] text-left">Đang đăng nhập...</span>
						<svg
							className="animate-spin"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="#00101A"
								strokeWidth="3"
								strokeDasharray="31.4"
								strokeDashoffset="10"
							/>
						</svg>
					</>
				) : (
					<>
						<span className="w-[225px] text-left">LOGIN With Google</span>
						<Icon name="google" size={24} />
					</>
				)}
			</button>

			{error && (
				<div role="alert" className="mt-2 text-sm text-red-400">
					<span>
						{error === "auth_failed"
							? "Đăng nhập thất bại."
							: "Có lỗi xảy ra khi đăng nhập."}
					</span>{" "}
					<a
						href="/login"
						className="underline text-[#15D5CA] hover:opacity-80"
					>
						Thử lại
					</a>
				</div>
			)}
		</div>
	);
}
