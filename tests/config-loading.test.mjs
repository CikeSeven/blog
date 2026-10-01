import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("config setup works without native TypeScript stripping", () => {
	// Astro closes its temporary Vite runner after reading astro.config.mjs.
	// Integration hooks must still be able to import config and dependencies.
	const result = spawnSync(
		process.execPath,
		[
			"--no-experimental-strip-types",
			"--input-type=module",
			"--eval",
			`
				import assert from "node:assert/strict";
				import { createRequire } from "node:module";
				import { pathToFileURL } from "node:url";
				const require = createRequire(import.meta.url);
				const astroPackage = pathToFileURL(require.resolve("astro/package.json"));
				const { resolveConfig } = await import(new URL("dist/core/config/config.js", astroPackage));
				const { astroConfig, userConfig } = await resolveConfig({ root: process.cwd() }, "sync");
				const integration = userConfig.integrations.find((entry) => entry.name === "shirones");
				assert.ok(integration, "the native config must load the Shirone integration");
				const updates = [];
				await integration.hooks["astro:config:setup"]({
					config: astroConfig,
					command: "sync",
					updateConfig: (update) => updates.push(update),
					injectRoute: () => {},
					addWatchFile: () => {},
					logger: { info: () => {}, warn: () => {} },
				});
				assert.equal(updates.length, 1);
				assert.equal(typeof updates[0].site, "string");
				assert.equal(updates[0].trailingSlash, "always");
				assert.ok(updates[0].fonts.length > 0);
				assert.ok(updates[0].markdown.processor);
				assert.ok(updates[0].integrations.length > 0);
				console.log("config setup OK");
			`,
		],
		{
			cwd: projectRoot,
			encoding: "utf8",
			timeout: 30_000,
			env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
		},
	);
	assert.ifError(result.error);
	assert.equal(result.status, 0, result.stderr || result.stdout);
	assert.match(result.stdout, /config setup OK/);
});
