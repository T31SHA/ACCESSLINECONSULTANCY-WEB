/**
 * Writes 4:3 crops (`<name>.4x3.webp`) next to the originals in public/images for every photo
 * taller than 4:3. Card and hero boxes are 4:3 on mobile; serving an uncropped 2:3 source there
 * wastes ~50% of the bytes (Lighthouse "Properly size images"). Originals stay untouched.
 * Run: node scripts/crop-photos.mjs [dir ...]   (idempotent; optional dirs limit it, e.g. services industries)
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..", "public", "images");
// Vertical focal point (0 = top, 1 = bottom) per photo; default centre-high for people shots.
const focus = {
  "about-nairobi-skyscrapers": 0.3, "contact-nairobi-sunset": 0.5, "work-case-study-media-production": 0.12,
  "service-events": 0.35, "service-capacity-building-training": 0.35, "service-pr-media-relations": 0.33,
  "service-strategic-planning": 0.65, "service-strategic-communications": 0.3, "service-creative-multimedia": 0.15,
  "industry-retail-fmcg": 0.25, "industry-financial-services": 0.3,
};
const only = process.argv.slice(2);

for (const dir of await readdir(root)) {
  if (only.length && !only.includes(dir)) continue;
  for (const file of await readdir(path.join(root, dir))) {
    if (!file.endsWith(".webp") || file.includes(".4x3.")) continue;
    const src = path.join(root, dir, file);
    const { width, height } = await sharp(src).metadata();
    const h = Math.round((width * 3) / 4);
    if (height <= h + 2) continue; // already 4:3 or wider
    const name = file.replace(/\.webp$/, "");
    const top = Math.round((height - h) * (focus[name] ?? 0.4));
    await sharp(src).extract({ left: 0, top, width, height: h }).webp({ quality: 82 }).toFile(path.join(root, dir, `${name}.4x3.webp`));
    console.log(`${dir}/${name}.4x3.webp  ${width}×${h}`);
  }
}
