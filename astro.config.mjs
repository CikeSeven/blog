import { defineConfig } from "astro/config";
import { createJiti } from "jiti";

// Keep deferred integration imports outside Astro's temporary config runner,
// including on hosts without native TypeScript stripping. That runner closes
// before astro:config:setup; Jiti owns the TypeScript loading independently.
const { default: shirones } = await createJiti(import.meta.url).import(
	"./src/integration/index.ts",
);

// The integration drives every mode, this repository included: integrations,
// fonts, markdown, vite aliases/plugins, trailingSlash and the image endpoint
// all come from `src/integration/` and `src/config/integrationsConfig.ts`.
// Do not re-add per-mode config here — update `src/config/` so both modes
// stay in lockstep (see `src/config/README.md`).
export default defineConfig({
	integrations: [shirones()],
});
