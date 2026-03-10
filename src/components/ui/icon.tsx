interface IconProps {
	name: string;
	size: number;
	className?: string;
}

export function Icon({ name, size, className }: IconProps) {
	if (name === "google") {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				className={className}
				aria-hidden="true"
			>
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
		);
	}

	if (name === "flag-vn") {
		return (
			<span
				className={className}
				style={{
					width: size,
					height: size,
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<svg
					width={20}
					height={15}
					viewBox="0 0 20 15"
					fill="none"
					aria-hidden="true"
				>
					<rect width="20" height="15" fill="#DA251D" />
					<polygon
						points="10,1.5 11.47,6.18 16.39,6.18 12.46,9.07 13.93,13.75 10,10.86 6.07,13.75 7.54,9.07 3.61,6.18 8.53,6.18"
						fill="#FFFF00"
					/>
				</svg>
			</span>
		);
	}

	if (name === "chevron-down") {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 16 16"
				fill="none"
				className={className}
				aria-hidden="true"
			>
				<path
					d="M4 6l4 4 4-4"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	return null;
}
