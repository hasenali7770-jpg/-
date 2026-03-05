import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    }

    const baseSlug = slugify(title) || `course`;
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const newCourse = await prisma.course.create({
      data: {
        slug: uniqueSlug,
        title,
        description: String(body.description || ""),
        price: parseFloat(body.price),
        image: body.image || null,
        introVideoUrl: body.videoUrl || body.introVideoUrl || null,
        category: body.category || null,
        level: body.level || null,
        language: body.language || null,
        instructorName: body.instructorName || null,
        isPublished: Boolean(body.isPublished ?? false),
      },
    });
    return NextResponse.json(newCourse);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'فشل حفظ الكورس' }, { status: 500 });
  }
}
