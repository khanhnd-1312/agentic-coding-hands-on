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
			"Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện \u2013 những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
		thumbnailUrl: "/images/homepage/award-top-talent.png",
		quantity: 10,
		unit: "Cá nhân",
		prize: "7.000.000 VNĐ",
		prizeLabel: "cho mỗi giải thưởng",
		detailImageUrl: "/images/awards/top-talent.png",
	},
	{
		id: "award-top-project",
		slug: "top-project",
		name: "Top Project",
		description:
			"Giải thưởng Top Project vinh danh cho tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng. Hiệu quả vận hành tốt và sự tính thần làm việc tập thể. Đây là các dự án có tổ chức phân tập kỹ thuật cao, hiệu quả lao động tốt và chi phí được tối ưu rõ rệt. Các dự án xuất sắc và nhận được phản hồi tích cực từ khách hàng. Giải thưởng cũng ghi nhận sự tuân thủ chuẩn phát triển với kỳ vọng phát triển dự án, tạo nên mô hình tiêu biểu về sự xuất sắc và chuyên nghiệp.",
		thumbnailUrl: "/images/homepage/award-top-project.png",
		quantity: 2,
		unit: "Tập thể",
		prize: "15.000.000 VNĐ",
		prizeLabel: "cho mỗi giải thưởng",
		detailImageUrl: "/images/awards/top-project.png",
	},
	{
		id: "award-top-project-leader",
		slug: "top-project-leader",
		name: "Top Project Leader",
		description:
			"Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc \u2013 những người hiểu rõ tầm nhìn tổ chức, liên tục kiến tạo giá trị cho khách hàng, mặt, và tư duy \u201CAim High \u2013 Be Agile\u201D trong mọi bài toán. Họ là những cá nhân có năng lực lãnh đạo nổi bật, biết cách truyền cảm hứng và dẫn dắt đội nhóm vượt qua thử thách để đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Momotaro, và trưởng thành đã trở thành phiên bản tốt hơn \u2013 hạnh phúc hơn của chính mình.",
		thumbnailUrl: "/images/homepage/award-top-project-leader.png",
		quantity: 3,
		unit: "Cá nhân",
		prize: "7.000.000 VNĐ",
		prizeLabel: "cho mỗi giải thưởng",
		detailImageUrl: "/images/awards/top-project-leader.png",
	},
	{
		id: "award-best-manager",
		slug: "best-manager",
		name: "Best Manager",
		description:
			"Giải thưởng Best Manager vinh danh những cá nhân \u2013 người đã sẵn đặt mục đích của cá nhân trên cả, và bắt rễ với truyền tải kỳ vọng, tạo động lực để mỗi cá nhân hiểu rõ quá trình đóng góp và phát triển bản thân cùng công ty và chức. Đoàn kết đội con. Họ, Mô hình học chinh phục hiệu quả mọi thử thách, bằng năng lực tổ chức dùng công nghệ tinh hoạt trong tổ chức kỳ người số. Họ cũng luôn hướng đến việc tạo ra khách hàng nội bộ và sự hợp tác cho bên, ứng dụng cũng hướng và tiến tới cho hòa sẻ cho những thay đổi và thể hiện cách mới.",
		thumbnailUrl: "/images/homepage/award-best-manager.png",
		quantity: 1,
		unit: "Cá nhân",
		prize: "10.000.000 VNĐ",
		detailImageUrl: "/images/awards/best-manager.png",
	},
	{
		id: "award-signature-creator",
		slug: "signature-creator",
		name: "Signature 2025 - Creator",
		description:
			"Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.\n\nTrong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần \u201CCreator\u201D đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
		thumbnailUrl: "/images/homepage/award-signature-creator.png",
		quantity: 1,
		unit: "Cá nhân hoặc tập thể",
		prize: "5.000.000 VNĐ",
		prizeLabel: "cho giải cá nhân",
		secondPrize: "8.000.000 VNĐ",
		secondPrizeLabel: "cho giải tập thể",
		detailImageUrl: "/images/awards/signature-creator.png",
	},
	{
		id: "award-mvp",
		slug: "mvp",
		name: "MVP (Most Valuable Person)",
		description:
			"Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm \u2013 gương mặt tiêu biểu đứng đầu và được bầu chọn bởi tập thể Sun*. Họ là người đã thể hiện năng lực vượt bội, tinh thần cống hiến bao lâu, và cảm hứng truyền cảm cho mọi người để tất cả đi xa hơn mỗi ngày.\n\nKhông chỉ với bài bật hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng truyền cho những \"Aim High - Rising Star\" \u2013 những người nghĩ, hành động và ảnh hưởng tích cực của cuộc mình đã nghỉ.\n\nMVP là người trỗi tự đây đó phẩm chất cốt lõi của người Sun* và, đồng thời nuôi trồng mình trong hành trình của Sun và trưởng thành hướng mà đã đến vẻ mục quả \"goal\" phía đến còn trước bao.",
		thumbnailUrl: "/images/homepage/award-mvp.png",
		quantity: 1,
		unit: "",
		prize: "15.000.000 VNĐ",
		detailImageUrl: "/images/awards/mvp.png",
	},
];
