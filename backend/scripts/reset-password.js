import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import process from "process";

const SALT_ROUNDS = 12;

/**
 * Script untuk reset/update password admin di database
 *
 * Usage:
 *   node scripts/reset-password.js <username> <new-password>
 *
 * Contoh:
 *   node scripts/reset-password.js admin password_baru_123
 *
 * Fitur:
 * - Validasi koneksi database
 * - Validasi password (minimal 6 karakter)
 * - Hash password menggunakan bcrypt dengan salt rounds 12
 * - Update timestamp otomatis
 * - Error handling yang komprehensif
 */

// Ambil argumen dari command line
const [, , username, newPassword] = process.argv;

// Validasi input
if (!username || !newPassword) {
  console.log(
    "\n❌ Usage: node scripts/reset-password.js <username> <new-password>\n",
  );
  console.log("Contoh:");
  console.log("  node scripts/reset-password.js admin password_baru_123\n");
  console.log("Catatan:");
  console.log("  - Password minimal 6 karakter");
  console.log(
    "  - Password akan di-hash menggunakan bcrypt sebelum disimpan\n",
  );
  process.exit(1);
}

// Validasi panjang password
if (newPassword.length < 6) {
  console.error("\n❌ Error: Password minimal 6 karakter!\n");
  process.exit(1);
}

async function resetPassword() {
  if (!process.env.DATABASE_URL) {
    console.error("\n❌ DATABASE_URL belum diatur di .env!");
    console.log("\n📝 Cara setup:");
    console.log("1. Buka backend/.env");
    console.log("2. Set DATABASE_URL dengan connection string Supabase Anda");
    console.log("3. Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    connectionTimeoutMillis: 10000,
    statement_timeout: 10000,
  });

  try {
    // Test koneksi database terlebih dahulu
    console.log("🔍 Testing database connection...");
    await pool.query("SELECT NOW()");
    console.log("✅ Database terkoneksi\n");

    // Cek apakah user ada
    console.log(`🔍 Mencari admin dengan username "${username}"...`);
    const { rows: existing } = await pool.query(
      "SELECT id, username, nama_lengkap, email, role FROM admin WHERE username = $1",
      [username],
    );

    if (existing.length === 0) {
      console.error(
        `\n❌ Admin dengan username "${username}" tidak ditemukan.\n`,
      );
      console.log("💡 Tips:");
      console.log("  - Pastikan username sudah benar");
      console.log(
        '  - Jalankan "node scripts/seed.js" untuk membuat admin default\n',
      );
      process.exit(1);
    }

    const admin = existing[0];
    console.log("✅ Admin ditemukan:");
    console.log(`   ID          : ${admin.id}`);
    console.log(`   Username    : ${admin.username}`);
    console.log(`   Nama        : ${admin.nama_lengkap}`);
    console.log(`   Email       : ${admin.email || "(tidak ada)"}`);
    console.log(`   Role        : ${admin.role}\n`);

    // Hash password baru dengan bcrypt
    console.log("🔐 Hashing password baru...");
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    console.log("✅ Password berhasil di-hash\n");

    // Update password di database
    console.log("💾 Mengupdate password di database...");
    const result = await pool.query(
      "UPDATE admin SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING updated_at",
      [hashedPassword, username],
    );

    if (result.rowCount === 0) {
      throw new Error("Update password gagal - tidak ada baris yang terupdate");
    }

    console.log("✅ Password berhasil diupdate!");
    console.log(`   Updated at  : ${result.rows[0].updated_at}\n`);

    console.log("🎉 Password reset berhasil!");
    console.log(`\n📝 Informasi:`);
    console.log(`   Username    : ${admin.username}`);
    console.log(
      `   Password    : ${"*".repeat(newPassword.length)} (${newPassword.length} karakter)`,
    );
    console.log(`   Hash format : bcrypt (salt rounds: ${SALT_ROUNDS})`);
    console.log(`\n💡 Tips:`);
    console.log("   - Simpan password baru dengan aman");
    console.log("   - Gunakan password yang kuat dan unik");
    console.log("   - Jangan share password ke siapapun\n");
  } catch (error) {
    console.error("\n❌ Reset password gagal!\n");
    console.error(`Error: ${error.message}\n`);

    // Provide helpful error messages
    if (error.message.includes("password authentication failed")) {
      console.log("🔧 Troubleshooting:");
      console.log("1. Pastikan DATABASE_URL di .env sudah benar");
      console.log(
        "2. Jika password mengandung karakter khusus, URL-encode terlebih dahulu",
      );
      console.log("3. Coba reset password database di Supabase Dashboard");
      console.log(
        "4. Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n",
      );
    } else if (error.message.includes("timeout")) {
      console.log("🔧 Troubleshooting:");
      console.log("1. Cek koneksi internet Anda");
      console.log("2. Pastikan Supabase project masih aktif");
      console.log("3. Coba gunakan connection string alternatif di .env\n");
    } else if (error.message.includes("CHECK constraint")) {
      console.log("🔧 Troubleshooting:");
      console.log(
        "1. Password harus di-hash dengan bcrypt (format: $2a$, $2b$, atau $2y$)",
      );
      console.log(
        "2. Pastikan script menggunakan bcrypt.hash() sebelum menyimpan\n",
      );
    } else {
      console.log(
        "🔧 Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n",
      );
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetPassword();
