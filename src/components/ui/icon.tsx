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
		// Exact Figma SVG — 24×24 viewBox, flag area 20×15 at offset (2,5)
		// Colors: #E31D1C (red), #FFD221 (star)
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				className={className}
				aria-hidden="true"
			>
				<rect x="2" y="5" width="20" height="15" fill="#E31D1C" />
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.0396 14.988L8.82029 17.0349L9.9001 13.4517L7.60389 11.1107L10.7696 11.0415L12.1702 7.50412L13.4465 11.0882L16.6047 11.1434L14.2314 13.5273L15.3396 16.9361L12.0396 14.988Z"
					fill="#FFD221"
				/>
			</svg>
		);
	}

	if (name === "chevron-down") {
		// Exact Figma SVG — solid filled downward triangle
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				className={className}
				aria-hidden="true"
			>
				<path d="M7 10L12 15L17 10H7Z" fill="white" />
			</svg>
		);
	}

	if (name === "notification-bell") {
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
					d="M21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 3.46957 10.2107 2.96086 10.5858 2.58579C10.9609 2.21071 11.4696 2 12 2C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4C14 4.1 14 4.19 14 4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM14 21C14 21.5304 13.7893 22.0391 13.4142 22.4142C13.0391 22.7893 12.5304 23 12 23C11.4696 23 10.9609 22.7893 10.5858 22.4142C10.2107 22.0391 10 21.5304 10 21"
					fill="white"
				/>
			</svg>
		);
	}

	if (name === "user-avatar") {
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
					d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
					fill="white"
				/>
			</svg>
		);
	}

	if (name === "arrow-up") {
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
					d="M8.49945 18.3104L5.68945 15.5004L12.0595 9.12043H7.10945V5.69043H18.3095V16.8904H14.8895V11.9404L8.49945 18.3104Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "pen") {
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
					d="M20.8067 6.72951C21.1967 6.33951 21.1967 5.68951 20.8067 5.31951L18.4667 2.97951C18.0967 2.58951 17.4467 2.58951 17.0567 2.97951L15.2167 4.80951L18.9667 8.55951M3.09668 16.9395V20.6895H6.84668L17.9067 9.61951L14.1567 5.86951L3.09668 16.9395Z"
					fill="white"
				/>
			</svg>
		);
	}

	return null;
}
