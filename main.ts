/**
 * news-image-20261125 — "The World in One Day — 25 November 2026".
 *
 * A single-image summary of Wednesday 25 November 2026's world news.
 * The bundled entry.png is a bold 2x4 multi-panel news poster (1024x1024)
 * whose eight panels, headline text verified against reporting published
 * on 25 November 2026, are:
 *
 *  1. UKRAINE STRIKES RUSSIAN SHIPS — President Zelenskyy confirmed
 *     Ukraine hit a Russian cargo ship in the Gulf of Finland (Saturday
 *     drone strike) and struck two Russian vessels off Libya, sinking a
 *     warship in Benghazi harbour.
 *  2. 3 TANKERS HIT IN HORMUZ — Iran's Revolutionary Guard Navy said
 *     three oil tankers were hit by naval mines in the Strait of Hormuz.
 *  3. NATO JETS TO POLAND — NATO plans an early-warning aircraft
 *     deployment in Poland after missiles landed there during an attack
 *     on Ukraine.
 *  4. HOUTHI ROCKET KILLS 53 — A Houthi rocket attack on a military
 *     camp in Yemen killed at least 53 soldiers of the internationally
 *     recognised government; Houthi forces pushed to within 60 km of Aden.
 *  5. TRUMP HONOURS GIULIANI — Donald Trump awarded Rudy Giuliani the
 *     Presidential Medal of Freedom.
 *  6. HUAWEI GUILTY IN U.S. TRIAL — Huawei was convicted in a US
 *     criminal trial over its Iran business (trade-secret theft).
 *  7. KING TIDES FLOOD CALIFORNIA — Record king tides (8.23 ft at
 *     Crissy Field, San Francisco, beating the November record of
 *     7.97 ft from 1982) flooded the California coast, from Malibu to
 *     Marin County, days before Thanksgiving.
 *  8. ENGLAND BEAT AUSTRALIA — England won the second T20I by eight
 *     wickets, chasing 185, to level the five-match series 1-1.
 *
 * This program only copies the bundled image to the output directory.
 * Node 22, standard library only, no network access. Deterministic:
 * the output is a byte-for-byte copy of the bundled entry.png.
 */
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES: number = 1048576;
const OUTPUT_NAME: string = "entry.png";

const here: string = dirname(fileURLToPath(import.meta.url));
const sourcePath: string = join(here, OUTPUT_NAME);
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath: string = join(outputDir, OUTPUT_NAME);

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, outputPath);

const size: number = statSync(outputPath).size;
if (size > MAX_BYTES) {
  throw new Error(
    `Output ${outputPath} is ${size} bytes, over the ${MAX_BYTES} byte limit.`,
  );
}

// Determinism self-check: the output must be a byte-for-byte copy of the
// bundled image, so both files must hash identically.
const sourceHash: string = createHash("sha256")
  .update(readFileSync(sourcePath))
  .digest("hex");
const outputHash: string = createHash("sha256")
  .update(readFileSync(outputPath))
  .digest("hex");
if (sourceHash !== outputHash) {
  throw new Error(
    `Output hash ${outputHash} does not match source hash ${sourceHash}.`,
  );
}

console.log(`Wrote ${outputPath} (${size} bytes, sha256 ${outputHash}).`);
