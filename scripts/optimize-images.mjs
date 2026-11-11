// Zmenší a překomprimuje obrázky ve složce (výchozí public/images) – max. šířka 1600 px.
// Použití: node scripts/optimize-images.mjs [slozka]
import sharp from "sharp";
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

const dir = process.argv[2] ?? "public/images";
const MAX = 1600;
sharp.cache(false);
let before = 0, after = 0;

function* walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

for (const p of walk(dir)) {
  const ext = extname(p).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  const size = statSync(p).size;
  before += size;
  if (size < 150_000) { after += size; continue; }
  const img = sharp(readFileSync(p), { failOn: "none" }).rotate().resize({ width: MAX, withoutEnlargement: true });
  const buf =
    ext === ".png" ? await img.png({ compressionLevel: 9, palette: true, quality: 85 }).toBuffer()
    : ext === ".webp" ? await img.webp({ quality: 80 }).toBuffer()
    : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  if (buf.length < size) { writeFileSync(p, buf); after += buf.length; } else after += size;
}
console.log(`Hotovo: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
