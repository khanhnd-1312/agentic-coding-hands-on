import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface ContentBlockProps {
	lang?: LanguagePreference;
}

export function ContentBlock({ lang = "vi" }: ContentBlockProps) {
	const t = homepageDictionary[lang].content;

	return (
		<div className="w-full max-w-[1152px] flex flex-col gap-8">
			{/* B4 paragraph 1 */}
			<p className="text-white text-2xl font-bold leading-8 text-justify whitespace-pre-line">
				{t.body}
			</p>

			{/* B4 centered quote */}
			<p className="text-white text-2xl font-bold leading-8 text-center whitespace-pre-line italic">
				{t.quote}
			</p>

			{/* B4 paragraph 3 */}
			<p className="text-white text-2xl font-bold leading-8 text-justify whitespace-pre-line">
				{t.body2}
			</p>
		</div>
	);
}
