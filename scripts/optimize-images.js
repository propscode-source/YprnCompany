/**
 * Script untuk mengoptimasi gambar di public/assets/images
 * Konversi JPG/PNG ke WebP dengan kompresi
 * Juga kompres logo kegiatan.jpg
 *
 * Jalankan: node scripts/optimize-images.js
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");
const imagesDir = path.join(publicDir, "assets", "images");

const processImage = async (inputPath, outputPath, options = {}) => {
  const { width, quality = 80, format = "webp" } = options;
  const stat = fs.statSync(inputPath);
  const sizeBefore = (stat.size / 1024).toFixed(0);

  let pipeline = sharp(inputPath);

  if (width) {
    pipeline = pipeline.resize(width, null, { withoutEnlargement: true });
  }

  if (format === "webp") {
    pipeline = pipeline.webp({ quality });
  } else if (format === "jpg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({
      quality: Math.min(quality, 100),
      compressionLevel: 9,
    });
  }

  await pipeline.toFile(outputPath);

  const newStat = fs.statSync(outputPath);
  const sizeAfter = (newStat.size / 1024).toFixed(0);
  const saved = (((stat.size - newStat.size) / stat.size) * 100).toFixed(1);

  console.log(
    `  ${path.basename(inputPath)} (${sizeBefore}KB) -> ${path.basename(outputPath)} (${sizeAfter}KB) [${saved}% saved]`,
  );
};

const processDirectory = async (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    // Skip jika sudah ada versi WebP
    const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    if (fs.existsSync(webpPath)) {
      console.log(`  [skip] ${entry.name} - WebP sudah ada`);
      continue;
    }

    // Konversi ke WebP
    await processImage(fullPath, webpPath, { quality: 80 });
  }
};

const run = async () => {
  console.log("=== Optimasi Gambar ===\n");

  // 1. Kompres logo kegiatan.jpg (1.2MB -> target <50KB)
  const logoPath = path.join(publicDir, "kegiatan.jpg");
  if (fs.existsSync(logoPath)) {
    console.log("1. Kompres logo (kegiatan.jpg):");
    // Buat versi WebP yang kecil untuk logo
    const logoWebp = path.join(publicDir, "kegiatan.webp");
    await processImage(logoPath, logoWebp, { width: 200, quality: 80 });
    // Buat juga versi JPG yang lebih kecil sebagai fallback
    const logoSmall = path.join(publicDir, "kegiatan-small.jpg");
    await processImage(logoPath, logoSmall, {
      width: 200,
      quality: 80,
      format: "jpg",
    });
    console.log("");
  }

  // 2. Kompres favicon
  const faviconPath = path.join(publicDir, "favicon.ico");
  if (fs.existsSync(faviconPath)) {
    const stat = fs.statSync(faviconPath);
    console.log(
      `2. Favicon: ${(stat.size / 1024).toFixed(0)}KB (pertimbangkan generate ulang dengan ukuran 32x32 atau 48x48)\n`,
    );
  }

  // 3. Konversi semua gambar di assets/images ke WebP
  if (fs.existsSync(imagesDir)) {
    console.log("3. Konversi gambar ke WebP:");
    await processDirectory(imagesDir);
    console.log("");
  }

  console.log("=== Selesai ===");
  console.log("\nLangkah selanjutnya:");
  console.log(
    "- Update src komponen untuk menggunakan .webp (dengan fallback .jpg)",
  );
  console.log("- Atau gunakan <picture> element dengan <source> WebP");
};

run().catch(console.error);
