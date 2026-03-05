# Esraa Al-Noor — Website (V2)

نسخة UI محسّنة “قريبة من ستايل مواقع الكورسات الكبيرة”:
- هوية لونية احترافية (Teal + Gold) + Dark Mode
- شعار + صور داخل `public/`
- صفحات: الرئيسية، الدورات (بحث/فلترة/ترتيب)، تفاصيل كورس، الأسعار، من نحن، تواصل، تفعيل، الشروط، الخصوصية
- زر واتساب ثابت (Floating)

## تشغيل محلياً
### متطلبات
- Node.js 18+
- PostgreSQL

### إعداد سريع
1) انسخ ملف البيئة:
- انسخ `env.example` إلى `.env` واملأ `DATABASE_URL`.

2) تثبيت الحزم:
```bash
npm install
```

3) Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init_platform
```

4) تشغيل:
```bash
npm run dev
```

ثم افتح: http://localhost:3000

### ملاحظات مهمة
- صفحة تفاصيل الكورس تعمل الآن على: `/{locale}/courses/{slug}`
- تفعيل الكود أصبح سيرفر-سايد عبر: `POST /{locale}/api/activate`

## التعديل السريع
- روابط التواصل: `lib/social.ts`
- الدورات والأسعار: `lib/courses.ts`
- النصوص والترجمة: `lib/i18n.ts`
- الألوان: `tailwind.config.ts`
