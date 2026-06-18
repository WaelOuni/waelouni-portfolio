import { spawnSync } from "node:child_process";

process.env.ASTRO_TELEMETRY_DISABLED ??= "1";

const command = process.platform === "win32" ? "astro.cmd" : "astro";
const result = spawnSync(command, process.argv.slice(2), {
  stdio: "inherit",
  shell: true,
  env: process.env
});

process.exit(result.status ?? 1);
