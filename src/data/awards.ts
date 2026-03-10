import type { AwardCategory } from "@/types/homepage";

/**
 * Static award category seed data.
 * Shared between the API route (/api/awards) and the page RSC (app/page.tsx)
 * so the page can read data directly without a self-referential HTTP fetch.
 */
export const AWARDS_SEED: AwardCategory[] = [
	{
		id: "award-top-talent",
		slug: "top-talent",
		name: "Top Talent",
		description:
			"Vinh danh những cá nhân xuất sắc nhất trong năm, thể hiện tài năng vượt trội và cống hiến đặc biệt cho tổ chức.",
		thumbnailUrl: "/images/homepage/award-top-talent.png",
	},
	{
		id: "award-top-project",
		slug: "top-project",
		name: "Top Project",
		description:
			"Tôn vinh các dự án tiêu biểu đã mang lại giá trị vượt trội, thể hiện sự sáng tạo và hiệu quả trong thực thi.",
		thumbnailUrl: "/images/homepage/award-top-project.png",
	},
	{
		id: "award-top-project-leader",
		slug: "top-project-leader",
		name: "Top Project Leader",
		description:
			"Ghi nhận những nhà lãnh đạo dự án xuất sắc, dẫn dắt đội nhóm vượt qua thách thức và đạt kết quả ấn tượng.",
		thumbnailUrl: "/images/homepage/award-top-project-leader.png",
	},
	{
		id: "award-best-manager",
		slug: "best-manager",
		name: "Best Manager",
		description:
			"Tôn vinh những người quản lý xuất sắc, biết truyền cảm hứng và phát triển nhân tài trong đội nhóm.",
		thumbnailUrl: "/images/homepage/award-best-manager.png",
	},
	{
		id: "award-signature-creator",
		slug: "signature-creator",
		name: "Signature Creator",
		description:
			"Vinh danh những cá nhân sáng tạo ra các sản phẩm, giải pháp mang dấu ấn riêng và tạo được sức ảnh hưởng lớn.",
		thumbnailUrl: "/images/homepage/award-signature-creator.png",
	},
	{
		id: "award-mvp",
		slug: "mvp",
		name: "MVP",
		description:
			"Most Valuable Player — Tôn vinh những cá nhân có đóng góp toàn diện và nổi bật nhất trong năm.",
		thumbnailUrl: "/images/homepage/award-mvp.png",
	},
];
