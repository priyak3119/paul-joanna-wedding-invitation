import { mkdir, copyFile, cp } from "node:fs/promises";
await mkdir("cloudflare-public", { recursive: true });
for (const file of ["index.html", "style.css", "script.js"]) {
  await copyFile(file, "cloudflare-public/" + file);
}
await cp("assets", "cloudflare-public/assets", { recursive: true });
