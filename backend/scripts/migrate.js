import "dotenv/config";
import pg from "pg";
import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL belum diatur di .env!");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    connectionTimeoutMillis: 5000,
    statement_timeout: 30000, // Migration bisa lebih lama
  });

  try {
    // Test koneksi
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Database terkoneksi:", rows[0].now);

    // Baca dan jalankan migration SQL
    const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    await pool.query(sql);
    console.log("Migration berhasil! Tabel yang dibuat:");
    console.log("  - admin");
    console.log("  - hero_beranda");
    console.log("  - kegiatan");

    // Verifikasi tabel
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    console.log("\nTabel di database:");
    tables.rows.forEach((row) => console.log(`  - ${row.table_name}`));
  } catch (error) {
    console.error("Migration gagal:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
