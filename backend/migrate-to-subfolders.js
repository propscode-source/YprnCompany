/**
 * Script untuk memindahkan foto-foto yang sudah ada di uploads/
 * ke subfolder uploads/kegiatan/ dan update path di database
 */

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");

async function migrate() {
  const pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "rimba_nusantara",
  });

  // Buat subfolder jika belum ada
  const subfolders = ["kegiatan", "sia", "sroi"];
  subfolders.forEach((dir) => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Folder dibuat: ${dirPath}`);
    }
  });

  // Ambil semua kegiatan dari database
  const [rows] = await pool.execute(
    "SELECT id, gambar, kategori FROM kegiatan WHERE gambar IS NOT NULL",
  );
  console.log(`\nDitemukan ${rows.length} foto yang perlu dipindahkan\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const { id, gambar, kategori } = row;
    const kat = kategori || "kegiatan";

    // Cek apakah sudah di subfolder (path sudah mengandung /uploads/kegiatan/, dll)
    if (gambar.match(/^\/uploads\/(kegiatan|sia|sroi)\//)) {
      console.log(`⏭️  ID ${id}: Sudah di subfolder, skip`);
      skipped++;
      continue;
    }

    // Path lama: /uploads/filename.jpg
    const filename = path.basename(gambar);
    const oldPath = path.join(__dirname, gambar);
    const newPath = path.join(uploadsDir, kat, filename);
    const newDbPath = `/uploads/${kat}/${filename}`;

    try {
      if (fs.existsSync(oldPath)) {
        // Pindahkan file
        fs.renameSync(oldPath, newPath);
        // Update database
        await pool.execute("UPDATE kegiatan SET gambar = ? WHERE id = ?", [
          newDbPath,
          id,
        ]);
        console.log(`✅ ID ${id}: ${gambar} → ${newDbPath}`);
        success++;
      } else {
        console.log(`⚠️  ID ${id}: File tidak ditemukan: ${oldPath}`);
        // Tetap update database path-nya
        await pool.execute("UPDATE kegiatan SET gambar = ? WHERE id = ?", [
          newDbPath,
          id,
        ]);
        failed++;
      }
    } catch (err) {
      console.error(`❌ ID ${id}: Error - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📋 Hasil migrasi:`);
  console.log(`   ✅ Berhasil dipindahkan: ${success}`);
  console.log(`   ⏭️  Sudah di subfolder: ${skipped}`);
  console.log(`   ⚠️  Gagal/tidak ditemukan: ${failed}`);

  await pool.end();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
