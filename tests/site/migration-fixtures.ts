import { expect, type Page } from "@playwright/test";

export async function mockMigrationAnalytics(page: Page): Promise<void> {
	await page.addInitScript(() => localStorage.setItem("umami.disabled", "1"));
	await page.route("https://cloud.umami.is/script.js", (route) =>
		route.fulfill({ contentType: "application/javascript", body: "" }),
	);
	await page.route("https://gateway.umami.is/**", (route) => route.abort());
	await page.route(
		"https://cloud.umami.is/analytics/us/api/**",
		async (route) => {
			const url = new URL(route.request().url());
			if (route.request().method() === "OPTIONS") {
				await route.fulfill({
					status: 204,
					headers: {
						"access-control-allow-origin": "*",
						"access-control-allow-headers": "*",
					},
				});
				return;
			}
			let body: unknown;
			if (url.pathname.includes("/share/")) {
				body = {
					websiteId: "50916ea0-00a3-4944-9877-c5a8860b97ad",
					token: "test-token",
					shareType: 1,
				};
			} else if (url.pathname.endsWith("/stats")) {
				expect(route.request().headers()["x-umami-share-context"]).toBe("1");
				body = url.searchParams.get("path")?.includes("deploy-ai-relay")
					? { pageviews: 37, visits: 19, visitors: 12 }
					: { pageviews: 123, visits: 45, visitors: 32 };
			} else {
				body = { visitors: 0 };
			}
			await route.fulfill({
				contentType: "application/json",
				headers: { "access-control-allow-origin": "*" },
				body: JSON.stringify(body),
			});
		},
	);
}

export async function waitForMigrationTheme(page: Page): Promise<void> {
	await page.waitForFunction(() =>
		getComputedStyle(document.documentElement)
			.getPropertyValue("--mc-primary")
			.trim()
			.startsWith("#"),
	);
	await page.waitForFunction(() =>
		[...document.querySelectorAll(".onload-animation")].every(
			(element) =>
				(element as HTMLElement).offsetParent === null ||
				getComputedStyle(element).opacity === "1",
		),
	);
}
