import { cookies } from "next/headers";
import { LoginPage } from "@/components/login/login-page";
import type { LanguagePreference } from "@/types/login";

type Props = {
	searchParams: Promise<{ error?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const { error } = await searchParams;
	const cookieStore = await cookies();
	const lang = (cookieStore.get("lang")?.value ?? "vi") as LanguagePreference;

	return <LoginPage initialError={error} initialLang={lang} />;
}
