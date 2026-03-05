import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!code) return NextResponse.json({ error: "الكود مطلوب" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "الايميل مطلوب" }, { status: 400 });

    const activation = await prisma.activationCode.findUnique({
      where: { code },
      include: { course: true },
    });

    if (!activation) return NextResponse.json({ error: "الكود غير موجود" }, { status: 404 });
    if (activation.isUsed) return NextResponse.json({ error: "هذا الكود مستخدم مسبقاً" }, { status: 409 });
    if (activation.expiresAt && activation.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "هذا الكود منتهي الصلاحية" }, { status: 410 });
    }

    // Create or get user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Mark code used + create enrollment (idempotent-ish)
    await prisma.$transaction(async (tx) => {
      await tx.activationCode.update({
        where: { code },
        data: {
          isUsed: true,
          usedByUserId: user.id,
          usedAt: new Date(),
        },
      });

      await tx.enrollment.upsert({
        where: { userId_courseId: { userId: user.id, courseId: activation.courseId } },
        update: {},
        create: { userId: user.id, courseId: activation.courseId },
      });
    });

    return NextResponse.json({
      ok: true,
      course: {
        slug: activation.course.slug,
        title: activation.course.title,
      },
    });
  } catch (error) {
    console.error("ACTIVATE Error:", error);
    return NextResponse.json({ error: "فشل تفعيل الكود" }, { status: 500 });
  }
}
