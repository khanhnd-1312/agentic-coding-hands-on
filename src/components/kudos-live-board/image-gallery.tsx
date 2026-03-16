import Image from "next/image";

interface ImageGalleryProps {
	images: string[];
}

const MAX_IMAGES = 5;

export function ImageGallery({ images }: ImageGalleryProps) {
	if (images.length === 0) return null;

	const visibleImages = images.slice(0, MAX_IMAGES);

	return (
		<div className="flex gap-2 overflow-hidden">
			{visibleImages.map((url) => (
				<a
					key={url}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="shrink-0 w-16 h-16 rounded-md overflow-hidden"
				>
					<Image
						src={url}
						alt=""
						width={64}
						height={64}
						className="object-cover w-full h-full"
					/>
				</a>
			))}
		</div>
	);
}
