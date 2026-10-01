import { expect, test } from "@playwright/test";
import {
	mockMigrationAnalytics,
	waitForMigrationTheme,
} from "./migration-fixtures";

const POST = "/posts/deploy-ai-relay/";
test.beforeEach(async ({ page }) => {
	await mockMigrationAnalytics(page);
});

test("preserves site identity and original article links", async ({ page }) => {
	await page.goto("/");
	await waitForMigrationTheme(page);
	await expect(page).toHaveTitle(/柒月的备忘录/);
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page.locator(`a[href="${POST}"]`).first()).toBeVisible();
	await expect(
		page.locator(".shirone-umami-stats--profile").first(),
	).toHaveAttribute("data-umami-loaded", "true");
	await expect(
		page
			.locator(".shirone-umami-stats--profile [data-shirone-umami-pageviews]")
			.first(),
	).toHaveAttribute("title", "123");
});

test("loads original article and statistics after Swup navigation", async ({
	page,
}) => {
	await page.goto("/");
	await waitForMigrationTheme(page);
	await page.waitForFunction(() => Boolean(window.swup));
	await page.evaluate(() => {
		(
			window as Window & { __migrationShell?: Element | null }
		).__migrationShell = document.querySelector("#top-row");
	});
	await page.locator(`a[href="${POST}"]`).first().click();
	await expect(page).toHaveURL(new RegExp(`${POST}$`));
	await expect(
		page.getByRole("region", {
			name: "如何从零开始搭建一个属于自己的AI中转站",
		}),
	).toBeVisible();
	await expect(page.locator("[data-banner-context-title]")).toHaveText(
		"如何从零开始搭建一个属于自己的AI中转站",
	);
	const stats = page.locator(`[data-shirone-umami][data-umami-path="${POST}"]`);
	await expect(stats).toHaveAttribute("data-umami-loaded", "true");
	await expect(stats.locator("[data-shirone-umami-pageviews]")).toHaveAttribute(
		"title",
		"37",
	);
	await expect(stats.locator("[data-shirone-umami-visits]")).toHaveAttribute(
		"title",
		"19",
	);
	expect(
		await page.evaluate(
			() =>
				(window as Window & { __migrationShell?: Element | null })
					.__migrationShell === document.querySelector("#top-row"),
		),
	).toBe(true);
	await expect(
		page.locator('img[src*="/images/posts/deploy-ai-relay/"]'),
	).toHaveCount(13);
});

test("preserves and filters all nine friends including Dian66", async ({
	page,
}) => {
	await page.goto("/friends/");
	await expect(page.locator(".friend-card")).toHaveCount(9);
	await expect(
		page.locator('a.friend-card[href="https://dian66y.top/"]'),
	).toContainText("Dian66");
	await page.locator(".friend-section__search input").fill("Dian66");
	await expect(page.locator(".friend-card")).toHaveCount(1);
	await expect(page).toHaveURL(/[?&]q=Dian66/);
});

test("preserves four personal projects without template replacements", async ({
	page,
}) => {
	await page.goto("/projects/");
	for (const title of ["deepseek-qqbot", "jotsy", "NowChat", "NowChat0"])
		await expect(
			page.getByRole("heading", { name: title, exact: true }),
		).toBeVisible();
});

test("mobile article remains readable and has numeric traffic statistics", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(POST);
	await waitForMigrationTheme(page);
	const stats = page.locator(`[data-shirone-umami][data-umami-path="${POST}"]`);
	await expect(stats).toBeVisible();
	await expect(stats).toHaveAttribute("data-umami-loaded", "true");
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth + 1,
		),
	).toBe(true);
});
