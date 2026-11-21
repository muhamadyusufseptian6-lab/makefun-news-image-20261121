// news-image-20261121 entry (Node 22, standard library only).
//
// The entry image is the entry.png checked in beside this file: a single
// 1024x1024 PNG summing up the world news of Saturday, 21 November 2026
// (Kyiv/Poland missile strikes, the Wall Street AI sell-off, the foiled
// Copenhagen assassination plot, COP31 overtime, the halted Iowa Army
// blast, and the JPMorgan/Visa/Mastercard vendor data breach).
//
// This program copies that image to the output directory. It is fully
// deterministic: two runs produce byte-identical output, and it makes no
// network requests.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve paths from this file's own location, never from process.cwd():
// the grader may run `node /bot/main.ts` from any working directory.
const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, "entry.png");

// The input directory is part of the standard entry interface; this
// entry needs no input files, but the variable is resolved the same way
// so the program honours the grader's layout either way.
const inputDir = process.env.MAKEFUN_INPUT_DIR ?? "/input";
void inputDir;

if (!statSync(source, { throwIfNoEntry: false })) {
  throw new Error(`entry image not found beside main.ts: ${source}`);
}
const expectedBytes = statSync(source).size;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, "entry.png");
copyFileSync(source, target);

// Confirm the copy is complete: a short write must never pass silently.
const writtenBytes = statSync(target).size;
if (writtenBytes !== expectedBytes) {
  throw new Error(
    `entry.png copy incomplete: wrote ${writtenBytes} of ${expectedBytes} bytes`,
  );
}
console.error(`wrote ${target} (${writtenBytes} bytes)`);
