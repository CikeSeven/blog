function isProbablyImageUrl(url: string): boolean {
	if (!/^https?:\/\//i.test(url)) {
		return false;
	}
	if (/\.(avif|webp|png|jpe?g|gif|bmp|svg)(\?|#|$)/i.test(url)) {
		return true;
	}
	return (
		/picsum\.photos/i.test(url) ||
		/images\.unsplash\.com/i.test(url) ||
		/images\.pexels\.com/i.test(url) ||
		/w\.wallhaven\.cc/i.test(url)
	);
}

function isLikelyThumbnailUrl(url: string): boolean {
	return (
		/th\.wallhaven\.cc/i.test(url) ||
		/\/small\//i.test(url) ||
		/\/thumb\//i.test(url) ||
		/[?&](w|width|h|height)=\d{1,3}(\D|$)/i.test(url)
	);
}

function getImageQualityScore(url: string): number {
	let score = 0;

	if (/w\.wallhaven\.cc\/full\//i.test(url)) {
		score += 50;
	}
	if (/img-original|original/i.test(url)) {
		score += 45;
	}
	if (/\/large2x\//i.test(url)) {
		score += 25;
	}
	if (/\/large\//i.test(url)) {
		score += 15;
	}
	if (/\/regular\//i.test(url)) {
		score += 10;
	}
	if (/\.(png|jpe?g|webp)(\?|#|$)/i.test(url)) {
		score += 5;
	}
	if (isLikelyThumbnailUrl(url)) {
		score -= 80;
	}

	return score;
}

function collectUrls(value: unknown, urls: string[]): void {
	if (!value) {
		return;
	}

	if (typeof value === "string") {
		if (isProbablyImageUrl(value)) {
			urls.push(value);
		}
		return;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			collectUrls(item, urls);
		}
		return;
	}

	if (typeof value !== "object") {
		return;
	}

	const obj = value as Record<string, unknown>;

	const directKeys = [
		"url",
		"path",
		"download_url",
		"image",
		"img",
		"link",
	];
	for (const key of directKeys) {
		collectUrls(obj[key], urls);
	}

	const nestedListKeys = ["data", "items", "results", "photos", "images"];
	for (const key of nestedListKeys) {
		collectUrls(obj[key], urls);
	}

	const nestedObjectKeys = ["src", "urls", "thumbs"];
	for (const key of nestedObjectKeys) {
		const nested = obj[key];
		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			const nestedObj = nested as Record<string, unknown>;
			if (key === "thumbs") {
				collectUrls(nestedObj.original ?? nestedObj.large, urls);
				continue;
			}
			collectUrls(
				nestedObj.original ??
					nestedObj.full ??
					nestedObj.raw ??
					nestedObj.large2x ??
					nestedObj.landscape ??
					nestedObj.large ??
					nestedObj.regular ??
					nestedObj.medium ??
					nestedObj.small ??
					nestedObj.tiny,
				urls,
			);
		}
	}
}

function uniqueUrls(urls: string[]): string[] {
	const deduped = [...new Set(urls)].filter((url) => !isLikelyThumbnailUrl(url));
	return deduped.sort((a, b) => getImageQualityScore(b) - getImageQualityScore(a));
}

export function parseImageApiResponse(payload: string): string[] {
	const jsonUrls: string[] = [];
	try {
		const parsed = JSON.parse(payload) as unknown;
		collectUrls(parsed, jsonUrls);
	} catch {
		// Not JSON, fallback to text parsing below.
	}
	if (jsonUrls.length > 0) {
		return uniqueUrls(jsonUrls);
	}

	const lineUrls = payload
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => isProbablyImageUrl(line));
	if (lineUrls.length > 0) {
		return uniqueUrls(lineUrls);
	}

	const inlineUrls = (payload.match(/https?:\/\/[^\s"'`<>]+/gi) || []).filter(
		(url) => isProbablyImageUrl(url),
	);
	return uniqueUrls(inlineUrls);
}
