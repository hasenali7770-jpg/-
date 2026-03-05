import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { courses as localCourses, formatIQD } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);
  const slug = params.slug;

  // 1) Try local courses first (for backward compatibility)
  const local = localCourses.find((c) => c.slug === slug);
  if (local) {
    return (
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
          <div>
            <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-stroke bg-white shadow-soft dark:border-night-stroke dark:bg-night-surface">
              <Image src={local.cover} alt={local.title[locale]} fill className="object-cover" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-ink dark:text-night-text">{local.title[locale]}</h1>
            <p className="mt-3 text-sm leading-7 text-muted dark:text-night-muted">{local.short[locale]}</p>

            <div className="mt-8 rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
              <div className="text-sm font-semibold text-ink dark:text-night-text">{locale === "ar" ? "ماذا ستتعلم" : "What you'll learn"}</div>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-7 text-muted dark:text-night-muted">
                <li>{locale === "ar" ? "منهج مرتب + تطبيق عملي" : "Structured curriculum + practical work"}</li>
                <li>{locale === "ar" ? "ملفات مساعدة وتمارين" : "Resources and exercises"}</li>
                <li>{locale === "ar" ? "مشروع نهائي" : "Final project"}</li>
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
              <div className="text-2xl font-bold text-ink dark:text-night-text">{formatIQD(local.priceIQD, locale)}</div>
              <Link
                href={`/${locale}/activate`}
                className="mt-4 block w-full rounded-2xl bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-95"
              >
                {tr.buy}
              </Link>
              <div className="mt-4 text-xs leading-6 text-muted dark:text-night-muted">
                {locale === "ar"
                  ? "بعد الشراء/التفعيل راح تقدر تشوف المحاضرات داخل صفحة (تعلماتي)."
                  : "After purchase/activation you'll access the lessons in My Learning."}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    );
  }

  // 2) DB course
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) return notFound();

  const cover = course.image || "/course-covers/default.svg";
  const price = formatIQD(course.price, locale);

  const totalLessons = course.lessons.length;

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <div>
          <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-stroke bg-white shadow-soft dark:border-night-stroke dark:bg-night-surface">
            <Image src={cover} alt={course.title} fill className="object-cover" />
          </div>

          <div className="mt-6">
            <div className="text-xs text-muted dark:text-night-muted">
              <span>{course.category || (locale === "ar" ? "بدون تصنيف" : "Uncategorized")}</span>
              <span className="mx-2">•</span>
              <span>{course.level || (locale === "ar" ? "مستوى غير محدد" : "Level N/A")}</span>
              <span className="mx-2">•</span>
              <span>{course.language || locale}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-ink dark:text-night-text">{course.title}</h1>
            {course.instructorName ? (
              <div className="mt-2 text-sm text-muted dark:text-night-muted">
                {locale === "ar" ? "المدرس:" : "Instructor:"} {course.instructorName}
              </div>
            ) : null}
            <p className="mt-4 text-sm leading-7 text-muted dark:text-night-muted">{course.description}</p>
          </div>

          {/* Curriculum */}
          <div className="mt-8 rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-ink dark:text-night-text">
                {locale === "ar" ? "محتوى الكورس" : "Curriculum"}
              </div>
              <div className="text-xs text-muted dark:text-night-muted">
                {locale === "ar" ? "عدد المحاضرات" : "Lessons"}: {totalLessons}
              </div>
            </div>

            {course.sections.length === 0 ? (
              <div className="mt-4 text-sm text-muted dark:text-night-muted">
                {locale === "ar"
                  ? "لسه ما تمت إضافة محاضرات/فصول لهذا الكورس."
                  : "No sections/lessons have been added yet."}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {course.sections.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-stroke p-4 dark:border-night-stroke">
                    <div className="text-sm font-semibold text-ink dark:text-night-text">{s.title}</div>
                    <ul className="mt-3 space-y-2">
                      {s.lessons.map((l) => (
                        <li key={l.id} className="flex items-center justify-between text-sm text-muted dark:text-night-muted">
                          <span className="line-clamp-1">{l.title}</span>
                          <span className="text-xs">
                            {l.isFreePreview ? (locale === "ar" ? "معاينة" : "Preview") : locale === "ar" ? "مغلق" : "Locked"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky buy card */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-stroke bg-white p-6 shadow-soft dark:border-night-stroke dark:bg-night-surface">
            <div className="text-2xl font-bold text-ink dark:text-night-text">{price}</div>
            <Link
              href={`/${locale}/activate?course=${encodeURIComponent(course.slug)}`}
              className="mt-4 block w-full rounded-2xl bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-95"
            >
              {tr.buy}
            </Link>

            <div className="mt-5 space-y-2 text-sm text-muted dark:text-night-muted">
              <div>• {locale === "ar" ? "وصول مدى الحياة" : "Lifetime access"}</div>
              <div>• {locale === "ar" ? "تحديثات مستمرة" : "Updates"}</div>
              <div>• {locale === "ar" ? "دعم" : "Support"}</div>
            </div>

            {course.introVideoUrl ? (
              <a
                href={course.introVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block text-center text-sm font-semibold text-brand hover:underline"
              >
                {locale === "ar" ? "مشاهدة فيديو تعريفي" : "Watch intro"}
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </Container>
  );
}
