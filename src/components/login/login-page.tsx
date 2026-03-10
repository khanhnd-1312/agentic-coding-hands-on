"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginButton } from "./login-button";
import { LanguageSelector } from "./language-selector";
import type { LoginPageProps, LanguagePreference } from "@/types/login";

export function LoginPage({ initialError, initialLang }: LoginPageProps) {
	const [error, setError] = useState<string | undefined>(initialError);
	const [lang, setLang] = useState<LanguagePreference>(initialLang ?? "vi");

	return (
		<div className="bg-[#00101A] min-h-screen relative overflow-hidden">
			{/* Background keyvisual */}
			<Image
				src="/images/login/keyvisual.png"
				alt=""
				fill
				className="object-cover z-0"
				aria-hidden
				priority
			/>

			{/* Left-to-right gradient overlay */}
			<div
				aria-hidden
				className="absolute inset-0 z-1 bg-linear-to-r from-[#00101A] via-[#00101A]/25 to-transparent pointer-events-none"
			/>

			{/* Bottom vignette gradient */}
			<div
				aria-hidden
				className="absolute bottom-0 left-0 w-full h-full z-1 bg-linear-to-t from-[#00101A] to-transparent pointer-events-none"
			/>

			{/* Header */}
			<header className="w-full h-20 flex justify-between items-center py-3 px-4 md:px-12 lg:px-36 bg-[rgba(11,15,18,0.8)] backdrop-blur-sm absolute top-0 z-10">
				<Image
					src="/images/login/logo.png"
					alt="SAA 2025 logo"
					width={52}
					height={56}
				/>
				<LanguageSelector lang={lang} onLangChange={setLang} />
			</header>

			{/* Hero section */}
			<main className="w-full flex flex-col items-start pt-20 pb-0 px-4 md:px-12 lg:px-36 gap-30 absolute top-20 z-10">
				{/* B.1_KeyVisual — ROOT FURTHER image */}
				<div className="w-full lg:w-[1152px] flex flex-col gap-20">
					<div className="w-full lg:w-[1152px] h-[200px] flex items-center">
						<Image
							src="/images/login/root-further.png"
							alt="Root Further"
							width={451}
							height={200}
							className="object-contain"
						/>
					</div>

					{/* B.2_content + B.3_Login */}
					<div className="w-full lg:w-[496px] flex flex-col gap-6 pl-4">
						<p className="w-full lg:w-[480px] text-white text-[16px] md:text-[20px] font-bold leading-10 tracking-[0.5px] font-[var(--font-montserrat)]">
							{lang === "vi" ? (
								<>
									Bắt đầu hành trình của bạn cùng SAA 2025.
									<br />
									Đăng nhập để khám phá!
								</>
							) : (
								<>
									Begin your journey with SAA 2025.
									<br />
									Sign in to explore!
								</>
							)}
						</p>

						<LoginButton lang={lang} error={error} onError={(msg) => setError(msg ?? undefined)} />
					</div>
				</div>

				<noscript>
					<p className="text-white">
						JavaScript is required to sign in.
					</p>
				</noscript>
			</main>

			{/* Footer */}
			<footer className="w-full flex justify-between items-center py-10 px-4 md:px-12 lg:px-22.5 border-t border-[#2E3940] text-white text-base font-bold absolute bottom-0 z-10">
				<span className="w-full text-center font-[var(--font-montserrat-alt)]">
					Bản quyền thuộc về Sun* © 2025
				</span>
			</footer>
		</div>
	);
}
