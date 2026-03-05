import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import readline from "readline";
import process from "process";

const SALT_ROUNDS = 12;

/**
 * Script interaktif untuk update password admin
 *
 * Usage:
 *   node scripts/update-password.js
 *
 * Script ini akan meminta input:
 * 1. Username admin yang akan diupdate
 * 2. Password baru (dengan konfirmasi)
 *
 * Fitur:
 * - Input interaktif dengan readline
 * - Validasi password (minimal 6 karakter, harus match)
 * - Hash password menggunakan bcrypt
 * - Menampilkan preview sebelum update
 */

// Setup readline interface untuk input interaktif
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function untuk input dengan promise
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Helper function untuk input password (hidden)
function questionPassword(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";
    process.stdin.on("data", function (char) {
      char = char.toString();

      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl+D
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        case "\u007f": // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          process.stdout.write("*");
          break;
      }
    });
  });
}

async function updatePassword() {
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
    // Test koneksi database
    console.log("\n🔍 Testing database connection...");
    await pool.query("SELECT NOW()");
    console.log("✅ Database terkoneksi\n");

    // Input username
    const username = await question("Masukkan username admin: ");
    if (!username.trim()) {
      console.error("\n❌ Username tidak boleh kosong!\n");
      process.exit(1);
    }

    // Cek apakah user ada
    console.log(`\n🔍 Mencari admin dengan username "${username}"...`);
    const { rows: existing } = await pool.query(
      "SELECT id, username, nama_lengkap, email, role FROM admin WHERE username = $1",
      [username.trim()],
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

    // Input password baru
    console.log("📝 Masukkan password baru:");
    console.log(
      "   (Password minimal 6 karakter, akan disembunyikan saat mengetik)\n",
    );

    const newPassword = await questionPassword("Password baru: ");

    if (newPassword.length < 6) {
      console.error("\n❌ Error: Password minimal 6 karakter!\n");
      process.exit(1);
    }

    // Konfirmasi password
    const confirmPassword = await questionPassword("\nKonfirmasi password: ");

    if (newPassword !== confirmPassword) {
      console.error("\n❌ Error: Password tidak cocok!\n");
      process.exit(1);
    }

    // Konfirmasi update
    console.log("\n📋 Preview:");
    console.log(`   Username    : ${admin.username}`);
    console.log(
      `   Password    : ${"*".repeat(newPassword.length)} (${newPassword.length} karakter)`,
    );
    console.log(`   Hash format : bcrypt (salt rounds: ${SALT_ROUNDS})\n`);

    const confirm = await question(
      "Apakah Anda yakin ingin mengupdate password? (y/N): ",
    );

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      console.log("\n❌ Update dibatalkan.\n");
      process.exit(0);
    }

    // Hash password baru dengan bcrypt
    console.log("\n🔐 Hashing password baru...");
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    console.log("✅ Password berhasil di-hash\n");

    // Update password di database
    console.log("💾 Mengupdate password di database...");
    const result = await pool.query(
      "UPDATE admin SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING updated_at",
      [hashedPassword, username.trim()],
    );

    if (result.rowCount === 0) {
      throw new Error("Update password gagal - tidak ada baris yang terupdate");
    }

    console.log("✅ Password berhasil diupdate!");
    console.log(`   Updated at  : ${result.rows[0].updated_at}\n`);

    console.log("🎉 Password update berhasil!");
    console.log(`\n💡 Tips:`);
    console.log("   - Simpan password baru dengan aman");
    console.log("   - Gunakan password yang kuat dan unik");
    console.log("   - Jangan share password ke siapapun\n");
  } catch (error) {
    console.error("\n❌ Update password gagal!\n");
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
    } else {
      console.log(
        "🔧 Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n",
      );
    }

    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

updatePassword();
