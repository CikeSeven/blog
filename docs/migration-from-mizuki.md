# 从 Mizuki 迁移到 Shirone

上游基准：`LyraVoid/Shirone@b7560d7f5bf95423260a309df0bd1616e7a3a031`，
Shirone `1.0.3`。迁移前版本：`a07c760f553b5e0e510d9e53e8a9eee4432bea41`。

保留正式地址 `https://blog.sisct.xyz/`、中文、上海时区、站点名称、
博主资料、社交链接、原文章 URL、13 张文章截图、原有公开图片、
本地音乐、9 条友链、4 个项目、设备数据及追番配置。
旧 `/diary/` 重定向到 `/moments/`。

原 `src/config.ts` 已拆分为 `src/config/*Config.ts`。
Umami 采集和公开数字在 `umamiConfig.ts` 配置，分享 URL 使用实际跳转的
美国区完整地址，不保存接口签发的临时 token。

上游示例文章和动态设为草稿，供语法文档和清单校验使用，不发布到正式站点。
示例相册隐藏；新增的罗盘、游戏和系列功能关闭；原空技能和时间线保持为空。
背景使用原有本地横幅，不再让构建依赖随机图片 API。
页面采用 Shirone 的 Material 3 Expressive 布局和字体。
旧主题记录的建站日期为 `2026-02-21`。

仍使用 Cloudflare Pages：构建 `pnpm build`，输出 `dist`，Node `24`。
上游部署工作流仅保留不会执行的示例；内容校验流程只允许被显式调用。

源码模式通过 Jiti 独立加载 TypeScript 集成，避免依赖宿主 Node 的类型擦除。
构建末尾的字体校验脚本使用同一加载方式。
否则 Astro 回退到临时 Vite runner 后会在读取配置时关闭它，后续
`astro:config:setup` 中的动态导入报 `Vite module runner has been closed.`。
`tests/config-loading.test.mjs` 在关闭原生类型擦除的子进程中复现并覆盖此路径；
所有站点配置仍由同一 `src/integration/` 驱动，npm 模式入口不变。

本站不生成或发布 TypeScript 声明文件，关闭 `declaration`，
`type-check` 使用 `tsc --noEmit`。
上游 `--isolatedDeclarations` 在未修改的主题源码中产生 26 个声明生成约束错误；
移除该非应用要求后保留完整 TypeScript 语义检查和 Astro 检查。

迁移保留本站原 Git 历史，不导入上游完整历史。后续同步以本文件记录的
上游 SHA 为三方对比基准。回滚时撤销迁移提交并重新部署，不强制推送。
