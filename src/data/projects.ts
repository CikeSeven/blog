/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "deepseek-qqbot",
		title: "deepseek-qqbot",
		summary: "基于OneBot协议的DeepSeek QQ机器人",
		category: "other",
		phase: "shipped",
		technologies: ["Python", "OneBot", "QQ Bot"],
		repository: "https://github.com/CikeSeven/deepseek-qqbot",
		featured: true,
		year: "2025-01-28 – 2025-02-23",
	},
	{
		key: "jotsy",
		title: "jotsy",
		summary:
			"An open-source, offline-first journaling app built with Flutter. Focus on your thoughts with rich metadata, mood tracking, and absolute privacy.",
		category: "mobile",
		phase: "building",
		technologies: ["Flutter", "Dart"],
		repository: "https://github.com/CikeSeven/jotsy",
		featured: true,
		year: "2026-03-08",
	},
	{
		key: "nowchat",
		title: "NowChat",
		summary: "一个面向Android的多模型聊天应用。",
		category: "mobile",
		phase: "building",
		technologies: ["Flutter", "Dart", "Android"],
		repository: "https://github.com/CikeSeven/NowChat",
		featured: true,
		year: "2025-11-08",
	},
	{
		key: "nowchat0",
		title: "NowChat0",
		summary: "使用api与ai聊天的Android项目",
		category: "mobile",
		phase: "shipped",
		technologies: ["Kotlin", "Android"],
		repository: "https://github.com/CikeSeven/NowChat0",
		featured: false,
		year: "2025-03-04 – 2026-02-13",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
