import { z } from "zod";

/* ─── User / Sunner ──────────────────────────────────────────────── */

export const UserSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	avatar_url: z.string().url().nullable(),
	department_id: z.string().uuid().nullable(),
	department_name: z.string().nullable(),
	kudos_received_count: z.number().int().min(0),
	tim_points: z.number().int().min(0),
	title: z.string().nullable(),
});
export type User = z.infer<typeof UserSchema>;

/* ─── Department ─────────────────────────────────────────────────── */

export const DepartmentSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
});
export type Department = z.infer<typeof DepartmentSchema>;

/* ─── Hashtag ────────────────────────────────────────────────────── */

export const HashtagSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
});
export type Hashtag = z.infer<typeof HashtagSchema>;

/* ─── Kudos ──────────────────────────────────────────────────────── */

export const KudosSchema = z.object({
	id: z.string().uuid(),
	sender_id: z.string().uuid(),
	receiver_id: z.string().uuid(),
	title: z.string().max(50).default(""),
	content: z.record(z.string(), z.unknown()), // Tiptap JSON (JSONB)
	is_anonymous: z.boolean().default(false),
	images: z.array(z.string().url()).default([]),
	heart_count: z.number().int().min(0),
	created_at: z.string().datetime(),
	sender: UserSchema.pick({
		id: true,
		name: true,
		avatar_url: true,
		department_name: true,
		kudos_received_count: true,
	}),
	receiver: UserSchema.pick({
		id: true,
		name: true,
		avatar_url: true,
		department_name: true,
		kudos_received_count: true,
	}),
	hashtags: z.array(HashtagSchema),
	is_liked_by_me: z.boolean(),
});
export type Kudos = z.infer<typeof KudosSchema>;

/* ─── Heart / Like ───────────────────────────────────────────────── */

export const HeartSchema = z.object({
	id: z.string().uuid(),
	user_id: z.string().uuid(),
	kudos_id: z.string().uuid(),
	is_special_day: z.boolean(),
	created_at: z.string().datetime(),
});
export type Heart = z.infer<typeof HeartSchema>;

/* ─── Secret Box ─────────────────────────────────────────────────── */

export const SecretBoxSchema = z.object({
	id: z.string().uuid(),
	user_id: z.string().uuid(),
	is_opened: z.boolean(),
	reward_content: z.string().nullable(),
	opened_at: z.string().datetime().nullable(),
});
export type SecretBox = z.infer<typeof SecretBoxSchema>;

/* ─── Special Day ────────────────────────────────────────────────── */

export const SpecialDaySchema = z.object({
	id: z.string().uuid(),
	date: z.string(), // YYYY-MM-DD
	multiplier: z.number().int().min(1).default(2),
});
export type SpecialDay = z.infer<typeof SpecialDaySchema>;

/* ─── Write Kudo Request Schemas ─────────────────────────────────── */

export const CreateKudoSchema = z.object({
	receiver_id: z.string().uuid(),
	title: z.string().min(1).max(50),
	content: z.record(z.string(), z.unknown()), // Tiptap JSON
	hashtag_ids: z.array(z.string().uuid()).min(1).max(5),
	image_urls: z.array(z.string().url()).max(5).default([]),
	is_anonymous: z.boolean().default(false),
});
export type CreateKudo = z.infer<typeof CreateKudoSchema>;

export const UserSearchQuerySchema = z.object({
	q: z.string().min(1),
});
export type UserSearchQuery = z.infer<typeof UserSearchQuerySchema>;

export const CreateHashtagSchema = z.object({
	name: z.string().min(1).max(100),
});
export type CreateHashtag = z.infer<typeof CreateHashtagSchema>;

/* ─── API Request Schemas ────────────────────────────────────────── */

export const KudosListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(20),
	hashtag: z.string().uuid().optional(),
	department: z.string().uuid().optional(),
});
export type KudosListQuery = z.infer<typeof KudosListQuerySchema>;

export const KudosHighlightsQuerySchema = z.object({
	hashtag: z.string().uuid().optional(),
	department: z.string().uuid().optional(),
});
export type KudosHighlightsQuery = z.infer<typeof KudosHighlightsQuerySchema>;

export const KudosIdParamSchema = z.object({
	id: z.string().uuid(),
});

export const UserIdParamSchema = z.object({
	id: z.string().uuid(),
});

/* ─── API Response Types ─────────────────────────────────────────── */

export interface KudosListResponse {
	data: Kudos[];
	page: number;
	limit: number;
	total: number;
	has_more: boolean;
}

export interface UserStats {
	kudos_received: number;
	kudos_sent: number;
	hearts_received: number;
	secret_boxes_opened: number;
	secret_boxes_unopened: number;
}

export interface SpotlightEntry {
	name: string;
	user_id: string;
	kudos_count: number;
}

export interface SpotlightResponse {
	total_kudos: number;
	entries: SpotlightEntry[];
}

export interface TopGiftSunner {
	user_id: string;
	name: string;
	avatar_url: string | null;
	gift_description: string;
}

export interface ProfilePreview {
	id: string;
	name: string;
	avatar_url: string | null;
	department_name: string | null;
	kudos_received_count: number;
	title: string | null;
}

export interface SpecialDayTodayResponse {
	is_special_day: boolean;
	multiplier: number;
}

/* ─── Tiptap Content Helpers ─────────────────────────────────────── */

/** Extract plain text from Tiptap JSON content for display in feeds */
export function getContentText(content: Record<string, unknown>): string {
	if (!content || typeof content !== "object") return "";
	const extractText = (node: Record<string, unknown>): string => {
		if (node.type === "text" && typeof node.text === "string") return node.text;
		if (Array.isArray(node.content)) {
			return (node.content as Record<string, unknown>[]).map(extractText).join("");
		}
		return "";
	};
	return extractText(content);
}

/* ─── Star Count Logic (BR-001) ──────────────────────────────────── */

export function getStarCount(kudosReceivedCount: number): 0 | 1 | 2 | 3 {
	if (kudosReceivedCount >= 50) return 3;
	if (kudosReceivedCount >= 20) return 2;
	if (kudosReceivedCount >= 10) return 1;
	return 0;
}
