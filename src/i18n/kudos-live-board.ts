import type { LanguagePreference } from "@/types/login";

export interface KudosLiveBoardDictionary {
	hero: {
		subtitle: string;
		logo: string;
		searchPlaceholder: string;
		profileSearch: string;
	};
	highlight: {
		caption: string;
		title: string;
		viewDetail: string;
		empty: string;
		filterHashtag: string;
		filterDepartment: string;
	};
	spotlight: {
		caption: string;
		title: string;
		searchPlaceholder: string;
		panZoomTooltip: string;
		empty: string;
	};
	allKudos: {
		caption: string;
		title: string;
		empty: string;
		copyLink: string;
		linkCopied: string;
	};
	sidebar: {
		kudosReceived: string;
		kudosSent: string;
		heartsReceived: string;
		secretBoxOpened: string;
		secretBoxUnopened: string;
		openSecretBox: string;
		topSunnerTitle: string;
		noData: string;
	};
	star: {
		tooltip1: string;
		tooltip2: string;
		tooltip3: string;
	};
	heart: {
		like: string;
		unlike: string;
	};
	loading: string;
	error: string;
	retry: string;
}

const vi: KudosLiveBoardDictionary = {
	hero: {
		subtitle: "Hệ thống ghi nhận và cảm ơn",
		logo: "KUDOS",
		searchPlaceholder:
			"Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
		profileSearch: "Tìm Sunner",
	},
	highlight: {
		caption: "Sun* Annual Awards 2025",
		title: "HIGHLIGHT KUDOS",
		viewDetail: "Xem chi tiết",
		empty: "Hiện tại chưa có Kudos nào.",
		filterHashtag: "Hashtag",
		filterDepartment: "Phòng ban",
	},
	spotlight: {
		caption: "Sun* Annual Awards 2025",
		title: "SPOTLIGHT BOARD",
		searchPlaceholder: "Tìm kiếm tên...",
		panZoomTooltip: "Pan/Zoom",
		empty: "Chưa có dữ liệu",
	},
	allKudos: {
		caption: "Sun* Annual Awards 2025",
		title: "ALL KUDOS",
		empty: "Hiện tại chưa có Kudos nào.",
		copyLink: "Copy Link",
		linkCopied: "Link copied — ready to share!",
	},
	sidebar: {
		kudosReceived: "Số Kudos bạn nhận được:",
		kudosSent: "Số Kudos bạn đã gửi:",
		heartsReceived: "Số tim bạn nhận được:",
		secretBoxOpened: "Số Secret Box bạn đã mở:",
		secretBoxUnopened: "Số Secret Box chưa mở:",
		openSecretBox: "Mở Secret Box 🎁",
		topSunnerTitle: "10 SUNNER NHẬN QUÀ MỚI NHẤT",
		noData: "Chưa có dữ liệu",
	},
	star: {
		tooltip1:
			"Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh.",
		tooltip2:
			"Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày.",
		tooltip3:
			"Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*.",
	},
	heart: {
		like: "Like kudos",
		unlike: "Unlike kudos",
	},
	loading: "Đang tải...",
	error: "Đã xảy ra lỗi",
	retry: "Thử lại",
};

const en: KudosLiveBoardDictionary = {
	hero: {
		subtitle: "Recognition & Appreciation System",
		logo: "KUDOS",
		searchPlaceholder:
			"Who would you like to send appreciation and recognition to today?",
		profileSearch: "Find Sunner",
	},
	highlight: {
		caption: "Sun* Annual Awards 2025",
		title: "HIGHLIGHT KUDOS",
		viewDetail: "View details",
		empty: "No Kudos available yet.",
		filterHashtag: "Hashtag",
		filterDepartment: "Department",
	},
	spotlight: {
		caption: "Sun* Annual Awards 2025",
		title: "SPOTLIGHT BOARD",
		searchPlaceholder: "Search name...",
		panZoomTooltip: "Pan/Zoom",
		empty: "No data available",
	},
	allKudos: {
		caption: "Sun* Annual Awards 2025",
		title: "ALL KUDOS",
		empty: "No Kudos available yet.",
		copyLink: "Copy Link",
		linkCopied: "Link copied — ready to share!",
	},
	sidebar: {
		kudosReceived: "Kudos received:",
		kudosSent: "Kudos sent:",
		heartsReceived: "Hearts received:",
		secretBoxOpened: "Secret Boxes opened:",
		secretBoxUnopened: "Secret Boxes unopened:",
		openSecretBox: "Open Secret Box 🎁",
		topSunnerTitle: "10 LATEST GIFT RECIPIENTS",
		noData: "No data available",
	},
	star: {
		tooltip1:
			"This Sunner has received 10 Kudos and started spreading warm energy to everyone around.",
		tooltip2:
			"This Sunner has received 20 Kudos and proven their influence through positive actions every day.",
		tooltip3:
			"This Sunner has received 50 Kudos and become a role model of recognition, sharing and spreading the Sun* spirit.",
	},
	heart: {
		like: "Like kudos",
		unlike: "Unlike kudos",
	},
	loading: "Loading...",
	error: "An error occurred",
	retry: "Retry",
};

export const kudosLiveBoardDictionary: Record<
	LanguagePreference,
	KudosLiveBoardDictionary
> = { vi, en };
