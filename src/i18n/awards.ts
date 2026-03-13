import type { LanguagePreference } from "@/types/login";
import type { AwardSlug } from "@/types/homepage";

export interface AwardTranslation {
	description: string;
	unit?: string;
	prizeLabel?: string;
	secondPrizeLabel?: string;
}

export interface AwardsDictionary {
	pageTitle: string;
	quantityLabel: string;
	prizeLabel: string;
	orSeparator: string;
	awardImageAlt: string;
	navAriaLabel: string;
	kudos: {
		caption: string;
		title: string;
		description: string;
		detail: string;
		detailAriaLabel: string;
	};
	awards: Record<AwardSlug, AwardTranslation>;
}

const vi: AwardsDictionary = {
	pageTitle: "Hệ thống giải thưởng SAA 2025",
	quantityLabel: "Số lượng giải thưởng:",
	prizeLabel: "Giá trị giải thưởng:",
	orSeparator: "Hoặc",
	awardImageAlt: "Hình ảnh giải thưởng",
	navAriaLabel: "Danh mục giải thưởng",
	kudos: {
		caption: "Phong trào ghi nhận",
		title: "Sun* Kudos",
		description:
			"ĐIỂM MỚI CỦA SAA 2025 Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.",
		detail: "Chi tiết",
		detailAriaLabel: "Xem Sun* Kudos Live board",
	},
	awards: {
		"top-talent": {
			description:
				"Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện \u2013 những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
			unit: "Cá nhân",
			prizeLabel: "cho mỗi giải thưởng",
		},
		"top-project": {
			description:
				"Giải thưởng Top Project vinh danh cho tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng. Hiệu quả vận hành tốt và sự tính thần làm việc tập thể. Đây là các dự án có tổ chức phân tập kỹ thuật cao, hiệu quả lao động tốt và chi phí được tối ưu rõ rệt. Các dự án xuất sắc và nhận được phản hồi tích cực từ khách hàng. Giải thưởng cũng ghi nhận sự tuân thủ chuẩn phát triển với kỳ vọng phát triển dự án, tạo nên mô hình tiêu biểu về sự xuất sắc và chuyên nghiệp.",
			unit: "Tập thể",
			prizeLabel: "cho mỗi giải thưởng",
		},
		"top-project-leader": {
			description:
				"Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc \u2013 những người hiểu rõ tầm nhìn tổ chức, liên tục kiến tạo giá trị cho khách hàng, mặt, và tư duy \u201CAim High \u2013 Be Agile\u201D trong mọi bài toán. Họ là những cá nhân có năng lực lãnh đạo nổi bật, biết cách truyền cảm hứng và dẫn dắt đội nhóm vượt qua thử thách để đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Momotaro, và trưởng thành đã trở thành phiên bản tốt hơn \u2013 hạnh phúc hơn của chính mình.",
			unit: "Cá nhân",
			prizeLabel: "cho mỗi giải thưởng",
		},
		"best-manager": {
			description:
				"Giải thưởng Best Manager vinh danh những cá nhân \u2013 người đã sẵn đặt mục đích của cá nhân trên cả, và bắt rễ với truyền tải kỳ vọng, tạo động lực để mỗi cá nhân hiểu rõ quá trình đóng góp và phát triển bản thân cùng công ty và chức. Đoàn kết đội con. Họ, Mô hình học chinh phục hiệu quả mọi thử thách, bằng năng lực tổ chức dùng công nghệ tinh hoạt trong tổ chức kỳ người số. Họ cũng luôn hướng đến việc tạo ra khách hàng nội bộ và sự hợp tác cho bên, ứng dụng cũng hướng và tiến tới cho hòa sẻ cho những thay đổi và thể hiện cách mới.",
			unit: "Cá nhân",
		},
		"signature-creator": {
			description:
				"Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.\n\nTrong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần \u201CCreator\u201D đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
			unit: "Cá nhân hoặc tập thể",
			prizeLabel: "cho giải cá nhân",
			secondPrizeLabel: "cho giải tập thể",
		},
		mvp: {
			description:
				"Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm \u2013 gương mặt tiêu biểu đứng đầu và được bầu chọn bởi tập thể Sun*. Họ là người đã thể hiện năng lực vượt bội, tinh thần cống hiến bao lâu, và cảm hứng truyền cảm cho mọi người để tất cả đi xa hơn mỗi ngày.\n\nKhông chỉ với bài bật hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng truyền cho những \"Aim High - Rising Star\" \u2013 những người nghĩ, hành động và ảnh hưởng tích cực của cuộc mình đã nghỉ.\n\nMVP là người trỗi tự đây đó phẩm chất cốt lõi của người Sun* và, đồng thời nuôi trồng mình trong hành trình của Sun và trưởng thành hướng mà đã đến vẻ mục quả \"goal\" phía đến còn trước bao.",
		},
	},
};

const en: AwardsDictionary = {
	pageTitle: "SAA 2025 Award System",
	quantityLabel: "Number of awards:",
	prizeLabel: "Prize value:",
	orSeparator: "Or",
	awardImageAlt: "Award image for",
	navAriaLabel: "Award categories",
	kudos: {
		caption: "Recognition movement",
		title: "Sun* Kudos",
		description:
			"NEW AT SAA 2025 A recognition and appreciation activity among colleagues, happening for the first time for all Sunners. The activity will launch in November 2025, encouraging Sun* people to share words of recognition and appreciation on the system announced by the organizing committee. This will serve as material for the Heads Council when selecting award recipients.",
		detail: "Details",
		detailAriaLabel: "View Sun* Kudos Live board",
	},
	awards: {
		"top-talent": {
			description:
				"The Top Talent award honors outstanding individuals \u2013 those who continuously demonstrate solid professional expertise, exceptional work performance, always delivering value beyond expectations, and are highly regarded by clients and teammates. With a spirit of readiness to take on any task assigned by the organization, they are always a source of inspiration, driving motivation and creating a positive impact on the entire team.",
			unit: "Individual",
			prizeLabel: "per award",
		},
		"top-project": {
			description:
				"The Top Project award honors exceptional project teams with business results that exceed expectations. Strong operational efficiency and a collaborative team spirit. These are projects with well-organized technical architecture, excellent labor efficiency, and clearly optimized costs. Outstanding projects that receive positive feedback from clients. The award also recognizes adherence to development standards with expectations for project development, creating a model of excellence and professionalism.",
			unit: "Team",
			prizeLabel: "per award",
		},
		"top-project-leader": {
			description:
				"The Top Project Leader award honors outstanding project managers \u2013 those who deeply understand the organizational vision, continuously create value for clients, and embrace the \"Aim High \u2013 Be Agile\" mindset in every challenge. They are individuals with remarkable leadership capabilities who know how to inspire and guide teams through challenges to achieve set goals, while maintaining the flame of passion, the Momotaro spirit, and growing into a better \u2013 happier version of themselves.",
			unit: "Individual",
			prizeLabel: "per award",
		},
		"best-manager": {
			description:
				"The Best Manager award honors individuals who place the purpose of the organization above all, convey expectations, and motivate each person to understand their contribution and personal development alongside the company. They unite the team, effectively conquer every challenge through organizational capability and agile technology application. They also strive to create internal customer satisfaction and cross-team collaboration, driving innovation and embracing change.",
			unit: "Individual",
		},
		"signature-creator": {
			description:
				"The Signature award honors individuals or teams who embody the distinctive spirit that Sun* aspires to in each era.\n\nIn 2025, the Signature award honors Creators \u2013 individuals/teams with a proactive and agile mindset, who always see opportunities in challenges and pioneer in action. They are keen problem-solvers who quickly identify and deliver practical solutions, bringing clear value to projects, clients, or the organization. With a creative mindset and the distinctive \"Creator\" spirit of Sun*, they not only respond positively to change but also proactively drive improvements, helping to shape new standards for how Sun* people create value.",
			unit: "Individual or team",
			prizeLabel: "for individual award",
			secondPrizeLabel: "for team award",
		},
		mvp: {
			description:
				"The MVP award honors the most outstanding individual of the year \u2013 the leading figure chosen by the Sun* community. They have demonstrated exceptional capability, a spirit of long-term dedication, and an inspiration that motivates everyone to go further every day.\n\nBeyond outstanding performance and work results, they are a source of inspiration for the \"Aim High - Rising Star\" \u2013 those who think, act, and positively influence those around them.\n\nThe MVP embodies the core qualities of a Sun* person while nurturing their own growth journey alongside Sun*'s vision and mission.",
		},
	},
};

export const awardsDictionary: Record<LanguagePreference, AwardsDictionary> = {
	vi,
	en,
};

/**
 * Returns an award with its translatable fields (description, unit, prizeLabel,
 * secondPrizeLabel) replaced by the values from the i18n dictionary for the
 * given language. Non-translatable fields (id, slug, name, thumbnailUrl, etc.)
 * are kept as-is.
 */
export function translateAward<T extends { slug: string; description: string; unit?: string; prizeLabel?: string; secondPrizeLabel?: string }>(
	award: T,
	lang: LanguagePreference,
): T {
	const t = awardsDictionary[lang].awards[award.slug as AwardSlug];
	if (!t) return award;
	return {
		...award,
		description: t.description,
		...(t.unit !== undefined && { unit: t.unit }),
		...(t.prizeLabel !== undefined && { prizeLabel: t.prizeLabel }),
		...(t.secondPrizeLabel !== undefined && { secondPrizeLabel: t.secondPrizeLabel }),
	};
}
