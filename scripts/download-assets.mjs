// Run with Bun 1.4+ on macOS. Uses existing qrencode and Apple Vision, no packages.
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const qrPayload = "https://some-in-univ.com/download?surface=desktop_qr";
export const artworkNames = [
  "01-campus-moment", "02-profile-interests", "03-privacy-settings",
  "04-university-verification", "05-matching-reason", "06-conversation",
];

function run(command) {
  const result = Bun.spawnSync(command, { cwd: root, stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}

// Rasterize the actual shipped qrencode SVG rectangles, not a second encoding.
export function rasterizeQr(svg) {
  const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!viewBox || viewBox[1] !== viewBox[2]) throw new Error("Invalid QR viewBox");
  const size = Number(viewBox[1]);
  const scale = 8;
  const width = size * scale;
  const stride = Math.ceil(width * 3 / 4) * 4;
  const bitmap = Buffer.alloc(54 + stride * width, 255);
  bitmap.fill(0, 0, 54);
  bitmap.write("BM");
  bitmap.writeUInt32LE(bitmap.length, 2);
  bitmap.writeUInt32LE(54, 10);
  bitmap.writeUInt32LE(40, 14);
  bitmap.writeInt32LE(width, 18);
  bitmap.writeInt32LE(-width, 22);
  bitmap.writeUInt16LE(1, 26);
  bitmap.writeUInt16LE(24, 28);
  const translation = svg.match(/id="Pattern" transform="translate\((\d+),(\d+)\)"/);
  if (!translation) throw new Error("Missing QR quiet-zone translation");
  const modules = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1" fill="#000000"\/>/g)];
  if (!modules.length) throw new Error("No QR modules found");
  for (const [, x, y] of modules) {
    const column = Number(x) + Number(translation[1]);
    const top = Number(y) + Number(translation[2]);
    for (let row = top * scale; row < (top + 1) * scale; row++) {
      const start = 54 + row * stride + column * scale * 3;
      bitmap.fill(0, start, start + scale * 3);
    }
  }
  return bitmap;
}

export async function decodeShippedQr() {
  const temporary = await mkdtemp(join(tmpdir(), "sometime-qr-"));
  try {
    const svg = await readFile(join(root, "public/images/download/desktop-download-qr.svg"), "utf8");
    const image = join(temporary, "qr.png");
    await new Bun.Image(rasterizeQr(svg)).png().write(image);
    return run(["swift", "scripts/download-assets.swift", "decode", image]);
  } finally {
    await rm(temporary, { recursive: true });
  }
}

async function generate(drops, socialSource) {
  if (!drops || !socialSource) throw new Error("Usage: bun scripts/download-assets.mjs <drops directory> <supplied OG PNG>");
  const temporary = await mkdtemp(join(tmpdir(), "sometime-assets-"));
  const download = join(root, "public/images/download");
  const social = join(root, "public/images/social");
  await Promise.all([mkdir(download, { recursive: true }), mkdir(social, { recursive: true })]);
  const records = [];
  async function record(source, output) {
    const bytes = await readFile(source);
    const shipped = await readFile(output);
    records.push({ source: source.split("/").pop(), sourceBytes: bytes.length,
      sourceSha256: createHash("sha256").update(bytes).digest("hex"),
      output: output.slice(join(root, "public").length), bytes: shipped.length,
      ...await new Bun.Image(shipped).metadata() });
  }
  try {
    for (const name of artworkNames) {
      const source = join(drops, `${name}.png`);
      const output = join(download, `${name}.webp`);
      await new Bun.Image(source).resize(990).webp({ quality: 88 }).write(output);
      await record(source, output);
    }
    const resized = join(temporary, "social-resized.png");
    const padded = join(temporary, "social-padded.png");
    await new Bun.Image(socialSource).resize(1200, 630, { fit: "inside" }).png().write(resized);
    run(["swift", "scripts/download-assets.swift", "pad", resized, padded]);
    const output = join(social, "sometime-share-20260908.jpg");
    await new Bun.Image(padded).jpeg({ quality: 88, progressive: true }).write(output);
    await record(socialSource, output);
    run(["qrencode", "-t", "SVG", "--inline", "-l", "M", "-m", "4", "-s", "1",
      "-o", join(download, "desktop-download-qr.svg"), qrPayload]);
    const decodedQr = await decodeShippedQr();
    if (decodedQr !== qrPayload) throw new Error(`QR mismatch: ${decodedQr}`);
    console.log(JSON.stringify({ records, decodedQr }, null, 2));
  } finally {
    await rm(temporary, { recursive: true });
  }
}

if (import.meta.main) await generate(...process.argv.slice(2));
