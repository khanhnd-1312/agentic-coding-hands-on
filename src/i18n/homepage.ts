import type { LanguagePreference } from "@/types/login";

export interface HomepageDictionary {
	// Countdown
	countdown: {
		comingSoon: string;
		days: string;
		hours: string;
		minutes: string;
	};
	// Event info
	event: {
		timeLabel: string;
		timeValue: string;
		venueLabel: string;
		venueValue: string;
		facebookNote: string;
	};
	// CTA buttons
	cta: {
		aboutAwards: string;
		aboutKudos: string;
	};
	// Content block (B4 ROOT FURTHER description — 3 sections from Figma)
	content: {
		body: string;
		quote: string;
		body2: string;
	};
	// Awards section
	awards: {
		caption: string;
		title: string;
		cardDetail: string;
		emptyState: string;
		errorState: string;
		retry: string;
	};
	// Kudos block
	kudos: {
		caption: string;
		title: string;
		description: string;
		detail: string;
	};
	// Header nav
	nav: {
		aboutSaa: string;
		awardsInfo: string;
		sunKudos: string;
		account: string;
		notifications: string;
		language: string;
	};
	// Footer
	footer: {
		copyright: string;
		aboutSaa: string;
		awardsInfo: string;
		sunKudos: string;
		standards: string;
	};
}

const vi: HomepageDictionary = {
	countdown: {
		comingSoon: "Coming soon",
		days: "NGÀY",
		hours: "GIỜ",
		minutes: "PHÚT",
	},
	event: {
		timeLabel: "Thời gian:",
		timeValue: "26/12/2025",
		venueLabel: "Địa điểm:",
		venueValue: "Âu Cơ Art Center",
		facebookNote: "Tường thuật trực tiếp qua sóng Livestream",
	},
	cta: {
		aboutAwards: "ABOUT AWARDS",
		aboutKudos: "ABOUT KUDOS",
	},
	content: {
		body: 'Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là "problem-solver" - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội. Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, "Root Further" đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025. Vượt ra khỏi nét nghĩa bề mặt, "Root Further" chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng "địa chất" ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp "trầm tích" để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang "hấp thụ" dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ "bén rễ" vào kỷ nguyên AI - một tầng "địa chất" hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.',
		quote:
			'"A tree with deep roots fears no storm"\n(Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)',
		body2: 'Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, "Root Further" còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn. Không ai biết trước ẩn sâu trong "lòng đất" của ngành công nghệ và thị trường hiện đại còn biết bao tầng "địa chất" bí ẩn. Chỉ biết rằng khi "Root Further" đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.',
	},
	awards: {
		caption: "Sun* annual awards 2025",
		title: "Hệ thống giải thưởng",
		cardDetail: "Chi tiết",
		emptyState: "Dữ liệu đang được cập nhật",
		errorState: "Không thể tải dữ liệu giải thưởng. Thử lại",
		retry: "Thử lại",
	},
	kudos: {
		caption: "Phong trào ghi nhận",
		title: "Sun* Kudos",
		description:
			"ĐIỂM MỚI CỦA SAA 2025\nHoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.",
		detail: "Chi tiết",
	},
	nav: {
		aboutSaa: "About SAA 2025",
		awardsInfo: "Awards Information",
		sunKudos: "Sun* Kudos",
		account: "Tài khoản",
		notifications: "Thông báo",
		language: "Chọn ngôn ngữ",
	},
	footer: {
		copyright: "Bản quyền thuộc về Sun* © 2025",
		aboutSaa: "About SAA 2025",
		awardsInfo: "Awards Information",
		sunKudos: "Sun* Kudos",
		standards: "Tiêu chuẩn chung",
	},
};

const en: HomepageDictionary = {
	countdown: {
		comingSoon: "Coming soon",
		days: "DAYS",
		hours: "HOURS",
		minutes: "MINUTES",
	},
	event: {
		timeLabel: "Date:",
		timeValue: "26/12/2025",
		venueLabel: "Venue:",
		venueValue: "Âu Cơ Art Center",
		facebookNote: "Live broadcast via Livestream",
	},
	cta: {
		aboutAwards: "ABOUT AWARDS",
		aboutKudos: "ABOUT KUDOS",
	},
	content: {
		body: 'Facing the rapidly changing landscape of the AI era and ever-increasing customer demands, Sun* has chosen a strategy of diversifying capabilities — not only striving to become an elite in its field, but also aiming higher: where every Sunner becomes a "problem-solver", an expert at resolving any challenge in projects, for clients and society alike. Drawing inspiration from the diversity of capabilities, agile growth, and the spirit of diving deep to break through in the AI era, "Root Further" was chosen as the official theme of the Sun* Annual Awards 2025. Beyond its surface meaning, "Root Further" represents our continuous journey to reach further, take root deeper, and touch the hidden "geological layers" beneath — to sustain, rise, and fuel the ever-burning passion for creating value that defines every Sun* person. Like roots constantly pushing deeper into the earth, weaving powerfully through each layer of "sediment" to absorb the purest essence, Sun* people are "absorbing" the nutrients of the era and the challenges of the market to reinvent themselves every day, expand their capabilities, and firmly "take root" in the AI era — a completely new, complex, and unpredictable "geological layer", yet one that holds infinite potential and opportunity.',
		quote:
			'"A tree with deep roots fears no storm"\n(Cây sâu bén rễ, bão giông chẳng nề - Vietnamese proverb)',
		body2: 'In the storm, only trees with strong enough roots can stand firm. An organization with individuals who are confident in their diverse capabilities, ready to create and embrace challenges, and in control of change — is not only resilient in the face of turbulence, but also capable of leveraging every advantage and conquering the challenges of the times. Far from just a name for a new chapter in the development journey, "Root Further" is also an encouragement for each of us to dare to believe in ourselves, dare to dig deep, unlock every potential, dare to break limits, and dare to become our most versatile and excellent selves. Because in the AI era, diverse capabilities and leveraging the power of the times are essential for lasting success. No one can predict what hidden "geological layers" lie deep within the technology industry and modern market. We only know that when "Root Further" has become our spirit of rootedness, we will not be afraid, but will feel increasingly excited before any uncharted territory on the journey forward. Because we always believe that in those very boundless regions, countless wonders and opportunities to soar are waiting for us.',
	},
	awards: {
		caption: "Sun* annual awards 2025",
		title: "Award System",
		cardDetail: "Details",
		emptyState: "Data is being updated",
		errorState: "Unable to load award data. Please try again",
		retry: "Retry",
	},
	kudos: {
		caption: "Recognition movement",
		title: "Sun* Kudos",
		description:
			"NEW AT SAA 2025\nA recognition and appreciation activity among colleagues, happening for the first time for all Sunners. The activity will launch in November 2025, encouraging Sun* people to share words of recognition and appreciation on the system announced by the organizing committee. This will serve as material for the Heads Council when selecting award recipients.",
		detail: "Details",
	},
	nav: {
		aboutSaa: "About SAA 2025",
		awardsInfo: "Awards Information",
		sunKudos: "Sun* Kudos",
		account: "Account",
		notifications: "Notifications",
		language: "Select language",
	},
	footer: {
		copyright: "Copyright belongs to Sun* © 2025",
		aboutSaa: "About SAA 2025",
		awardsInfo: "Awards Information",
		sunKudos: "Sun* Kudos",
		standards: "General Standards",
	},
};

export const homepageDictionary: Record<LanguagePreference, HomepageDictionary> =
	{ vi, en };
