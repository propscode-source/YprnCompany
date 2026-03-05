import "dotenv/config";
import pg from "pg";
import process from "process";

/**
 * Script untuk test koneksi database Supabase
 *
 * Usage:
 *   node scripts/test-connection.js
 *
 * Script ini akan:
 * 1. Test koneksi ke database
 * 2. Menampilkan informasi connection string (dengan password di-mask)
 * 3. Menampilkan informasi database (version, tables, dll)
 */

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum diatur di .env!");
    console.log("\n📝 Cara setup:");
    console.log("1. Buka backend/.env");
    console.log(
      "2. Ganti [YOUR-PASSWORD] dengan password database Supabase Anda",
    );
    console.log("3. Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n");
    process.exit(1);
  }

  // Mask password untuk keamanan (tampilkan hanya beberapa karakter pertama)
  const maskedUrl = process.env.DATABASE_URL.replace(
    /:([^:@]+)@/,
    (match, password) => {
      const masked =
        password.length > 4
          ? password.substring(0, 2) +
            "***" +
            password.substring(password.length - 2)
          : "***";
      return `:${masked}@`;
    },
  );

  console.log("🔍 Testing database connection...");
  console.log(`📍 Connection string: ${maskedUrl}\n`);

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    connectionTimeoutMillis: 10000,
    statement_timeout: 10000,
  });

  try {
    // Test 1: Basic connection
    console.log("⏳ Test 1: Basic connection...");
    const start = Date.now();
    await pool.query("SELECT NOW()");
    const latency = Date.now() - start;
    console.log(`✅ Connection successful! Latency: ${latency}ms\n`);

    // Test 2: Database version
    console.log("⏳ Test 2: Database version...");
    const { rows: versionRows } = await pool.query("SELECT version()");
    console.log(
      `✅ PostgreSQL version: ${versionRows[0].version.split(",")[0]}\n`,
    );

    // Test 3: List tables
    console.log("⏳ Test 3: Checking tables...");
    const { rows: tableRows } = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tableRows.length === 0) {
      console.log("⚠️  No tables found. Run migration first:");
      console.log("   node scripts/migrate.js\n");
    } else {
      console.log(`✅ Found ${tableRows.length} table(s):`);
      tableRows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    }

    // Test 4: Pool stats
    console.log("⏳ Test 4: Connection pool stats...");
    const { totalCount, idleCount, waitingCount } = pool;
    console.log(`✅ Pool stats:`);
    console.log(`   Total connections: ${totalCount}`);
    console.log(`   Idle connections: ${idleCount}`);
    console.log(`   Waiting requests: ${waitingCount}\n`);

    console.log(
      "🎉 All tests passed! Database connection is working correctly.",
    );
    console.log("\n💡 Next steps:");
    console.log("   - Run migration: node scripts/migrate.js");
    console.log("   - Seed admin user: node scripts/seed.js");
    console.log("   - Start server: npm start\n");
  } catch (error) {
    console.error("\n❌ Connection failed!\n");
    console.error(`Error: ${error.message}\n`);

    // Provide helpful error messages
    if (error.message.includes("password authentication failed")) {
      console.log("🔧 Troubleshooting:");
      console.log(
        "1. Pastikan password di .env sudah benar (copy dari Supabase Dashboard)",
      );
      console.log(
        "2. Jika password mengandung karakter khusus (-, @, #, $), URL-encode:",
      );
      console.log(
        "   - menjadi %2D, @ menjadi %40, # menjadi %23, $ menjadi %24",
      );
      console.log(
        "3. Coba reset password di Supabase Dashboard > Database Settings",
      );
      console.log(
        "4. Lihat TROUBLESHOOTING_DATABASE.md untuk panduan lengkap\n",
      );
    } else if (error.message.includes("timeout")) {
      console.log("🔧 Troubleshooting:");
      console.log("1. Cek koneksi internet Anda");
      console.log("2. Cek firewall/network settings");
      console.log("3. Pastikan Supabase project masih aktif");
      console.log("4. Coba gunakan direct connection (port 5432) di .env\n");
    } else if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.log("🔧 Troubleshooting:");
      console.log("1. Cek format connection string di .env");
      console.log("2. Pastikan project reference dan region sudah benar");
      console.log("3. Cek apakah Supabase project masih aktif\n");
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

testConnection();
