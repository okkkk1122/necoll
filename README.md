# نکول (Necoll) — فروشگاه آنلاین با HyperConfig System

فروشگاه آنلاین ماژولار با سیستم مدیریت **HyperConfig** — تنظیمات لحظه‌ای بدون ریستارت سرور.

## پیش‌نیاز: Docker Desktop

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) را نصب کنید
2. Docker Desktop را **اجرا** کنید (آیکون سبز در system tray)
3. در Settings → Resources حداقل **4GB RAM** اختصاص دهید

## راه‌اندازی سریع (Docker Desktop)

### Windows (PowerShell)

```powershell
cd c:\Users\mgh\Desktop\necoll
.\start.ps1
```

### یا دستی

```bash
docker compose up --build -d
```

اولین بار ۵–۱۰ دقیقه طول می‌کشد (دانلود imageها + build).

## آدرس‌ها

| سرویس | آدرس | توضیح |
|--------|------|--------|
| **فروشگاه** | http://localhost:3011 | سایت اصلی |
| **پنل مدیریت** | http://localhost:3011/admin | HyperConfig Panel |
| **API Health** | http://localhost:3011/api/health | وضعیت بک‌اند |
| **Adminer** | http://localhost:8080 | مدیریت دیتابیس |
| **MinIO Console** | http://localhost:9001 | مدیریت فایل‌ها |

### ورود پنل مدیریت

```
ایمیل: admin@necoll.ir
رمز: admin123
```

### Adminer (دیتابیس)

```
System: PostgreSQL
Server: postgres
Username: necoll
Password: necoll_secret
Database: necoll_db
```

### MinIO

```
User: necoll_minio
Password: necoll_minio_secret
```

## دستورات مفید Docker

```bash
# مشاهده لاگ همه سرویس‌ها
docker compose logs -f

# لاگ یک سرویس خاص
docker compose logs -f backend

# توقف
docker compose down

# توقف + حذف داده‌ها
docker compose down -v

# ری‌استارت یک سرویس
docker compose restart backend

# وضعیت سرویس‌ها
docker compose ps
```

## معماری Docker

```
                    ┌─────────────┐
                    │ Nginx :3011 │  ← نقطه ورود اصلی
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │ Store :3000 │ │ Admin :3001 │ │ Backend:4000│
    └─────────────┘ └─────────────┘ └──────┬──────┘
                                              │
                    ┌─────────────────────────┼─────────┐
                    │                         │         │
             ┌──────▼──────┐  ┌───────▼──────┐ ┌▼──────┐
             │ PostgreSQL  │  │    Redis     │ │ MinIO │
             └─────────────┘  └──────────────┘ └───────┘
```

## سرویس‌های Docker

| Container | Image | Port |
|-----------|-------|------|
| necoll-nginx | nginx:alpine | 3011 |
| necoll-store | build ./store | 3000 |
| necoll-admin | build ./admin | 3001 |
| necoll-backend | build ./backend | 4000 |
| necoll-postgres | postgres:16-alpine | 5432 |
| necoll-redis | redis:7-alpine | 6379 |
| necoll-minio | minio/minio | 9000, 9001 |
| necoll-adminer | adminer | 8080 |

## قابلیت‌ها

- **HyperConfig** — تنظیمات سه‌لایه، Sandbox، Reset
- **Drag & Drop** — چیدمان صفحه اصلی و کامپوننت‌ها
- **زرین‌پال** — پرداخت آنلاین (Sandbox)
- **MinIO** — آپلود تصویر
- **وبلاگ** — مقالات قابل مدیریت
- **نظرات** — سیستم امتیازدهی محصولات
- **چت AI** — دستیار فروشگاه
- **سبد خرید** — Checkout کامل

## عیب‌یابی Docker Desktop

**Docker اجرا نمی‌شود:**
- Docker Desktop را باز کنید و صبر کنید تا Ready شود

**Port 3011 اشغال است:**
```powershell
netstat -ano | findstr :3011
```

**Build fail:**
```bash
docker compose build --no-cache backend
docker compose up -d
```

**دیتابیس خالی:**
```bash
docker compose exec backend npx prisma db push
docker compose exec backend npm run db:seed
```

**ChunkLoadError / صفحه سفید در Firefox (necoll.ir):**

معمولاً مسیر `/_next/static/...` روی سرور به **ادمین** می‌رود به‌جای **فروشگاه**. HTML فروشگاه لود می‌شود ولی فایل‌های JS با 404 مواجه می‌شوند.

```bash
# تست روی سرور (باید 200 باشد، نه 404):
curl -I https://necoll.ir/_next/static/chunks/webpack-e5badf1716dd6f5a.js
```

**راه‌حل:** در Nginx سرور (جلوی Docker) حتماً `/_next/` را به کانتینر **store** بفرستید. نمونه: `nginx/host-reverse-proxy.example.conf`

یا همهٔ ترافیک را فقط به nginx داخل Docker بدهید (`SITE_PORT=80` و یک `proxy_pass` برای کل دامنه).

بعد از اصلاح `.env` برای دامنه واقعی:
```env
SITE_URL=https://necoll.ir
CORS_ORIGIN=https://necoll.ir
NEXT_PUBLIC_SITE_URL=https://necoll.ir
NEXT_PUBLIC_API_URL=https://necoll.ir/api
SITE_PORT=80
```
```bash
docker compose build --no-cache store admin
docker compose up -d
```
