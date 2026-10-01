import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "https://avatars.githubusercontent.com/u/78466962?v=4", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "柒月",
	bio: "树欲静而风不止",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/CikeSeven",
		},
		{
			name: "哔哩哔哩",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/422626047",
		},
		{
			name: "QQ",
			icon: "fa6-brands:qq",
			url: "tencent://message/?uin=3250306307&Site=qq&Menu=yes",
		},
	],
});
