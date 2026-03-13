import { cookies } from "next/headers";
import { z } from "zod";
import { LoginPage } from "@/components/login/login-page";

const langSchema = z.enum(["vi", "en"]).catch("vi");

type Props = {
	searchParams: Promise<{ error?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const { error } = await searchParams;
	const cookieStore = await cookies();
	const lang = langSchema.parse(cookieStore.get("lang")?.value);

	return <LoginPage initialError={error} initialLang={lang} />;
}
