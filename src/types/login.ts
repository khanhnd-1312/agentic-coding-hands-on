export type LanguagePreference = "vi" | "en";

export interface LoginPageProps {
	initialError?: string;
	initialLang?: LanguagePreference;
}
