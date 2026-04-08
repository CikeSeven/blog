import { parseImageApiResponse } from "./image-api-parser";

const imageApiCache = new Map<string, Promise<string[]>>();
const fallbackApiUrls = [
	"https://nekos.best/api/v2/neko?amount=20",
	"https://nekos.best/api/v2/waifu?amount=20",
	"https://nekos.best/api/v2/kitsune?amount=20",
];

export async function fetchImageApiImages(
	url: string,
	maxCount = 12,
): Promise<string[]> {
	const cacheKey = `${maxCount}|${url}`;
	const cached = imageApiCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const task = (async () => {
		const candidateUrls = [url, ...fallbackApiUrls.filter((u) => u !== url)];
		let lastError: unknown = null;

		for (const apiUrl of candidateUrls) {
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				const text = await response.text();
				const images = parseImageApiResponse(text).slice(0, maxCount);
				if (images.length > 0) {
					return images;
				}
			} catch (error) {
				lastError = error;
			}
		}

		console.warn("Failed to fetch images from API:", lastError);
		return [];
	})();

	imageApiCache.set(cacheKey, task);
	return task;
}
