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

	if (name === "target") {
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
					d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.84 21.79 9.69 21.39 8.61L19.79 10.21C19.93 10.8 20 11.4 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C12.6 4 13.2 4.07 13.79 4.21L15.4 2.6C14.31 2.21 13.16 2 12 2ZM19 2L15 6V7.5L12.45 10.05C12.3 10 12.15 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.85 14 11.7 13.95 11.55L16.5 9H18L22 5H19V2ZM12 6C10.4087 6 8.88258 6.63214 7.75736 7.75736C6.63214 8.88258 6 10.4087 6 12C6 13.5913 6.63214 15.1174 7.75736 16.2426C8.88258 17.3679 10.4087 18 12 18C13.5913 18 15.1174 17.3679 16.2426 16.2426C17.3679 15.1174 18 13.5913 18 12H16C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12C8 10.9391 8.42143 9.92172 9.17157 9.17157C9.92172 8.42143 10.9391 8 12 8V6Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "diamond") {
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
					d="M16 9H19L14 16M10 9H14L12 17M5 9H8L10 16M15 4H17L19 7H16M11 4H13L14 7H10M7 4H9L8 7H5M6 2L2 8L12 22L22 8L18 2H6Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "license") {
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
					d="M9.00011 10C9.01047 9.20761 9.32986 8.45055 9.89024 7.89017C10.4506 7.32979 11.2077 7.0104 12.0001 7.00004C12.7925 7.0104 13.5496 7.32979 14.11 7.89017C14.6704 8.45055 14.9897 9.20761 15.0001 10C14.9897 10.7925 14.6704 11.5495 14.11 12.1099C13.5496 12.6703 12.7925 12.9897 12.0001 13C11.2077 12.9897 10.4506 12.6703 9.89024 12.1099C9.32986 11.5495 9.01047 10.7925 9.00011 10ZM12.0001 19L16.0001 20V16.92C14.7938 17.6465 13.4081 18.0206 12.0001 18C10.5921 18.0206 9.20643 17.6465 8.00011 16.92V20M12.0001 4.00004C11.2121 3.98566 10.4294 4.1326 9.70027 4.43183C8.97112 4.73106 8.31087 5.17625 7.76011 5.74004C7.19022 6.2914 6.73988 6.95414 6.4371 7.68701C6.13431 8.41988 5.98557 9.20722 6.00011 10C5.98969 10.7878 6.14044 11.5695 6.4431 12.2969C6.74576 13.0243 7.19394 13.6821 7.76011 14.23C8.3083 14.7993 8.9674 15.25 9.69668 15.5544C10.426 15.8589 11.2099 16.0105 12.0001 16C12.7903 16.0105 13.5743 15.8589 14.3035 15.5544C15.0328 15.25 15.6919 14.7993 16.2401 14.23C16.8063 13.6821 17.2545 13.0243 17.5571 12.2969C17.8598 11.5695 18.0105 10.7878 18.0001 10C18.0146 9.20722 17.8659 8.41988 17.5631 7.68701C17.2603 6.95414 16.81 6.2914 16.2401 5.74004C15.6893 5.17625 15.0291 4.73106 14.2999 4.43183C13.5708 4.1326 12.7881 3.98566 12.0001 4.00004ZM20.0001 10C19.9788 10.9599 19.7858 11.9082 19.4301 12.8C19.1097 13.7075 18.6249 14.5481 18.0001 15.28V23L12.0001 21L6.00011 23V15.28C4.7058 13.8265 3.99361 11.9463 4.00011 10C3.98248 8.95062 4.18014 7.90873 4.58089 6.93868C4.98163 5.96864 5.57696 5.09103 6.33011 4.36004C7.06381 3.60013 7.94547 2.99867 8.92067 2.59277C9.89587 2.18686 10.9439 1.98514 12.0001 2.00004C13.0563 1.98514 14.1043 2.18686 15.0795 2.59277C16.0547 2.99867 16.9364 3.60013 17.6701 4.36004C18.4233 5.09103 19.0186 5.96864 19.4193 6.93868C19.8201 7.90873 20.0177 8.95062 20.0001 10Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "ic-arrow") {
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
					d="M4 12H20M20 12L14 6M20 12L14 18"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (name === "flag-en") {
		// Simplified Union Jack — 20×15 flag area at offset (2,5) in 24×24 viewBox
		// Colors: #012169 (blue), #C8102E (red), white
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				className={className}
				aria-hidden="true"
			>
				<svg x="2" y="5" width="20" height="15" viewBox="0 0 60 45">
					<rect width="60" height="45" fill="#012169" />
					<path d="M0 0L60 45M60 0L0 45" stroke="white" strokeWidth="9" />
					<path d="M0 0L60 45M60 0L0 45" stroke="#C8102E" strokeWidth="3" />
					<rect y="16.5" width="60" height="12" fill="white" />
					<rect x="24" width="12" height="45" fill="white" />
					<rect y="18" width="60" height="9" fill="#C8102E" />
					<rect x="25.5" width="9" height="45" fill="#C8102E" />
				</svg>
			</svg>
		);
	}

	if (name === "heart") {
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
					d="M12.1 21.35L10.55 19.93C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 19.94L12.1 21.35Z"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
			</svg>
		);
	}

	if (name === "heart-filled") {
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
					d="M12.1 21.35L10.55 19.93C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 19.94L12.1 21.35Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "copy") {
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
					d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "arrow-right") {
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
					d="M4 12H20M20 12L14 6M20 12L14 18"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (name === "gift") {
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
					d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4.02L11.5 3.34C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V17H20V19ZM20 14H4V8H9.08L7 10.83L8.62 12L11 8.76L12 7.4L13 8.76L15.38 12L17 10.83L14.92 8H20V14Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "pan-zoom") {
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
					d="M15 3L17.3 5.3L14.41 8.17L15.83 9.59L18.7 6.7L21 9V3H15ZM3 9L5.3 6.7L8.17 9.59L9.59 8.17L6.7 5.3L9 3H3V9ZM9 21L6.7 18.7L9.59 15.83L8.17 14.41L5.3 17.3L3 15V21H9ZM21 15L18.7 17.3L15.83 14.41L14.41 15.83L17.3 18.7L15 21H21V15Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "search") {
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
					d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "chevron-left") {
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
					d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "chevron-right") {
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
					d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (name === "star") {
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
					d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
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
