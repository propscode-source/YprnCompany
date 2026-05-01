# Konfigurasi Cloudflare WAF untuk API Access
# File: docs/CLOUDFLARE_WAF_SETUP.md
# Berlaku untuk: rimbanusantara.or.id

## Masalah

Ketika API tester (Postman, curl, Thunder Client, dll) melakukan request ke
`https://rimbanusantara.or.id/api/*`, response yang diterima adalah halaman HTML
Cloudflare "Attention Required!" bukan JSON dari backend:

```
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en-US"> ...
<h1 data-translate="block_headline">Sorry, you have been blocked</h1>
```

## Root Cause

Cloudflare WAF memblokir request yang dianggap bot atau ancaman karena:
1. Tools seperti Postman mengirim request tanpa cookie browser
2. Tidak ada `cf_clearance` cookie (hanya ada setelah melewati challenge browser)
3. User-Agent yang tidak standar (Postman/8.x, curl/7.x)
4. IP dari cloud hosting / VPN sering masuk threat database Cloudflare

## Solusi Lengkap

### Solusi Permanen (Wajib) — Di Dashboard Cloudflare

Masuk ke **Cloudflare Dashboard** → pilih domain `rimbanusantara.or.id`

---

#### 1. Buat WAF Rule: Bypass Bot Check untuk /api/*

> **Security → WAF → Create Rule**

```
Rule Name  : Allow API Requests
Expression : (http.request.uri.path matches "^/api/.*")
Action     : Skip → Skip all WAF rules
```

Atau jika ingin lebih selektif (hanya skip managed rules, bukan custom rules):

```
Action     : Skip → Skip managed rules
```

---

#### 2. Buat WAF Rule: Izinkan User-Agent API Testers

> **Security → WAF → Create Rule**

```
Rule Name  : Allow API Tester User-Agents
Expression : (http.request.uri.path matches "^/api/.*") and
             (http.user_agent matches "(?i)postman|insomnia|httpie|curl|thunderclient|paw|restclient")
Action     : Allow (Skip all security checks)
```

---

#### 3. Matikan Browser Integrity Check untuk /api/*

> **Security → Settings → Browser Integrity Check**

Tambahkan Page Rule:
```
URL        : rimbanusantara.or.id/api/*
Setting    : Browser Integrity Check → Off
```

Atau via WAF Custom Rule:
```
Rule Name  : Disable BIC for API
Expression : (http.request.uri.path matches "^/api/.*")
Action     : Skip → Browser Integrity Check
```

---

#### 4. Set Security Level lebih rendah untuk /api/*

> **Security → Settings → Security Level** (global: Medium atau High)

Buat Page Rule khusus API:
```
URL        : rimbanusantara.or.id/api/*
Setting    : Security Level → Essentially Off
```

---

#### 5. Tambahkan IP Whitelist Tester (Opsional)

Jika ada tim developer/tester dengan IP tetap:

> **Security → WAF → IP Access Rules**

```
Value      : <IP_tester>
Action     : Whitelist
Zone       : rimbanusantara.or.id
Note       : Developer/Tester - API Access
```

---

### Solusi Sementara — Via API Header (Tanpa ubah Cloudflare)

Tambahkan header berikut saat melakukan API testing di Postman/curl:

```
Accept: application/json
Content-Type: application/json
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

**Contoh curl:**
```bash
curl -X GET "https://rimbanusantara.or.id/api/kegiatan" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

**Contoh Postman Headers:**
| Key | Value |
|-----|-------|
| Accept | application/json |
| Content-Type | application/json |
| X-Requested-With | XMLHttpRequest |
| User-Agent | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 |

---

## Urutan Prioritas Perbaikan

1. **[HARUS]** → Buat WAF Rule "Allow API Requests" (poin 1 di atas)
2. **[HARUS]** → Matikan Browser Integrity Check untuk /api/* (poin 3)
3. **[DISARANKAN]** → Set Security Level "Essentially Off" untuk /api/* (poin 4)
4. **[OPSIONAL]** → Whitelist IP developer/tester (poin 5)

---

## Verifikasi

Setelah konfigurasi, test dengan:

```bash
# Test tanpa browser cookie (simulasi API tester)
curl -I "https://rimbanusantara.or.id/api/health" -H "Accept: application/json"

# Expected response:
# HTTP/2 200
# content-type: application/json
# {"status":"ok","db":{"latency_ms":...}}
```

Jika masih mendapat HTML, periksa urutan WAF Rule di dashboard (rule yang dibuat baru
mungkin perlu dipindahkan ke posisi lebih atas agar first-match).

---

## Catatan Keamanan

- WAF bypass **hanya berlaku untuk /api/***  — bukan seluruh domain
- WAF rules tetap aktif untuk halaman frontend (/, /kegiatan, dll)
- Bot protection di level aplikasi (rate limiting backend) tetap aktif
- Autentikasi JWT tetap wajib untuk admin endpoints
