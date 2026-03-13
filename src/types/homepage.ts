import { z } from "zod";

// ─── Award category slugs ────────────────────────────────────────────────────

export const AWARD_SLUGS = [
	"top-talent",
	"top-project",
	"top-project-leader",
	"best-manager",
	"signature-creator",
	"mvp",
] as const;

export type AwardSlug = (typeof AWARD_SLUGS)[number];

// ─── Award category schema ───────────────────────────────────────────────────

export const AwardCategorySchema = z.object({
	id: z.string(),
	slug: z.enum(AWARD_SLUGS),
	name: z.string(),
	description: z.string(),
	// Accept absolute URLs or root-relative paths (e.g. /images/...)
	thumbnailUrl: z.string().min(1),
	quantity: z.number().optional(),
	unit: z.string().optional(),
	prize: z.string().optional(),
	prizeLabel: z.string().optional(),
	secondPrize: z.string().optional(),
	secondPrizeLabel: z.string().optional(),
	detailImageUrl: z.string().optional(),
});

export type AwardCategory = z.infer<typeof AwardCategorySchema>;

// ─── Notification count schema ───────────────────────────────────────────────

export const NotificationCountSchema = z.object({
	count: z.number().int().min(0),
});

export type NotificationCount = z.infer<typeof NotificationCountSchema>;
