#!/bin/sh
# docker-entrypoint.sh
# Dijalankan setiap kali container start — aman untuk membuat direktori
# meskipun volume sudah di-mount

set -e

echo "🔧 Initializing upload directories..."

# Buat semua subdirektori uploads yang dibutuhkan
# mkdir -p aman dijalankan berulang kali (idempotent)
mkdir -p /app/uploads/beranda \
    /app/uploads/kegiatan \
    /app/uploads/sia \
    /app/uploads/sroi \
    /app/uploads/video

echo "✅ Upload directories ready:"
ls -la /app/uploads/

# Jalankan command yang diberikan (node server.js)
exec "$@"
