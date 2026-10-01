import type { AnnouncementConfig } from "@/types/announcementConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 公告栏配置
 * 组件显示由 sidebarConfig 统一控制
 */
export const announcementConfig: AnnouncementConfig = withUserConfig(
	"announcement",
	{
		title: "", // 公告标题，填空使用 i18n 字符串 Key.announcement
		content: "欢迎来到柒月的备忘录", // 公告内容
		closable: true, // 允许用户关闭公告
		link: {
			enable: true,
			text: "关于我",
			url: "/about/",
			external: false,
		},
	},
);
