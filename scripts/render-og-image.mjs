// Renders app/opengraph-image.png from public/logo-full-title.svg.
// Run after changing the logo: node scripts/render-og-image.mjs
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_HEIGHT = 420;
const SHEET = "#f0f8ff";
const RULE = "#b9d6f5";

const logoSvg = await readFile(`${root}public/logo-full-title.svg`);
const logo = await sharp(logoSvg, { density: 600 })
  .trim({ threshold: 1 })
  .resize({ height: LOGO_HEIGHT })
  .png()
  .toBuffer({ resolveWithObject: true });

const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="${SHEET}"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" fill="none" stroke="${RULE}" stroke-width="2"/>
</svg>`;

await sharp(Buffer.from(frame))
  .composite([
    {
      input: logo.data,
      left: Math.round((WIDTH - logo.info.width) / 2),
      top: Math.round((HEIGHT - logo.info.height) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(`${root}app/opengraph-image.png`);

console.log("Wrote app/opengraph-image.png");
