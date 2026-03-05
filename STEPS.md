# خطوات التشغيل والتطوير (مرتبة)

## 1) تجهيز البيئة
1. انسخ ملف البيئة:
   - أنشئ `.env` من المثال `env.example`
2. ثبت الحزم:
   - `npm install`

## 2) إعداد قاعدة البيانات
1. تأكد أن `DATABASE_URL` صحيح.
2. شغّل Prisma:
   - `npx prisma generate`
   - `npx prisma migrate dev --name init_platform`

> ملاحظة: ملف Prisma schema موجود حالياً في جذر المشروع: `schema.prisma`.

## 3) تشغيل المشروع
- `npm run dev`

## 4) إنشاء كورس (حالياً)
1. افتح لوحة التحكم:
   - `/{locale}/dashboard-israa` مثل: `/ar/dashboard-israa`
2. أضف كورس.
3. راح ينحفظ بـ DB ويظهر بصفحة الدورات.

## 5) فتح صفحة تفاصيل الكورس
- من صفحة الدورات اضغط (عرض)
- راح يفتح:
  - `/{locale}/courses/{slug}`

## 6) إنشاء كود تفعيل (حالياً يدوياً في DB)
لأن واجهة إنشاء الأكواد ما انبنت بعد، تقدر تسوي record في جدول `activation_codes`.

شكل الكود المقترح:
- `ALN-1A2B-3C4D`

الحقول:
- `code`: الكود
- `courseId`: رقم الكورس
- `expiresAt` (اختياري)

## 7) تفعيل الكود
1. افتح:
   - `/{locale}/activate`
2. اكتب email + الكود.
3. النظام يسوي:
   - User (إذا مو موجود)
   - Enrollment
   - ويعلّم الكود Used

---

# الخطوات القادمة (تنفيذ مرتب)

## المرحلة 1: Dashboard + Curriculum
1) **Dashboard CRUD**
- عرض جميع الكورسات
- تعديل وحذف

2) **Curriculum UI**
- إضافة Section
- إضافة Lessons داخل Section
- ترتيب (Order)

3) **رفع الصور**
- Cloudinary signature API
- Upload component
- حفظ URL داخل `Course.image`

## المرحلة 2: الدفع
1) اختيار بوابة دفع (Stripe أو MyFatoorah…)
2) `/api/checkout`
3) `/api/webhook`
4) تحديث `Order` + إنشاء `Enrollment`

## المرحلة 3: تجربة “منصة”
- My Learning
- Progress
- Wishlist
- Reviews
- SEO
