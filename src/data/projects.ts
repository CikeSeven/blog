// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "deepseek-qqbot",
		title: "deepseek-qqbot",
		description: "基于OneBot协议的DeepSeek QQ机器人",
		image: "",
		category: "other",
		techStack: ["Python", "OneBot", "QQ Bot"],
		status: "completed",
		sourceCode: "https://github.com/CikeSeven/deepseek-qqbot",
		startDate: "2025-01-28",
		endDate: "2025-02-23",
		featured: true,
		tags: ["Bot", "AI", "QQ"],
		showImage: false,
	},
	{
		id: "jotsy",
		title: "jotsy",
		description:
			"An open-source, offline-first journaling app built with Flutter. Focus on your thoughts with rich metadata, mood tracking, and absolute privacy.",
		image: "",
		category: "mobile",
		techStack: ["Flutter", "Dart"],
		status: "in-progress",
		sourceCode: "https://github.com/CikeSeven/jotsy",
		startDate: "2026-03-08",
		featured: true,
		tags: ["Journal", "Offline First", "Privacy"],
		showImage: false,
	},
	{
		id: "nowchat",
		title: "NowChat",
		description: "一个面向Android的多模型聊天应用。",
		image: "",
		category: "mobile",
		techStack: ["Flutter", "Dart", "Android"],
		status: "in-progress",
		sourceCode: "https://github.com/CikeSeven/NowChat",
		startDate: "2025-11-08",
		featured: true,
		tags: ["Chat", "AI", "Mobile"],
		showImage: false,
	},
	{
		id: "nowchat0",
		title: "NowChat0",
		description: "使用api与ai聊天的Android项目",
		image: "",
		category: "mobile",
		techStack: ["Kotlin", "Android"],
		status: "completed",
		sourceCode: "https://github.com/CikeSeven/NowChat0",
		startDate: "2025-03-04",
		endDate: "2026-02-13",
		tags: ["Android", "Chat", "AI"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
