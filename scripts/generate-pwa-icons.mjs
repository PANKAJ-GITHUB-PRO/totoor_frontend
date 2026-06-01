import sharp from "sharp";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const source = path.join(publicDir, "logo.png");

if (!existsSync(source)) {
  console.error("Missing public/logo.png — add the Tudoor logo first.");
  process.exit(1);
}

const targets = [
  { file: "pwa-192.png", size: 192 },
  { file: "pwa-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "maskable-icon-512.png", size: 512 },
];

for (const { file, size } of targets) {
  const out = path.join(publicDir, file);
  await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(out);
  console.log(`Wrote ${file}`);
}
