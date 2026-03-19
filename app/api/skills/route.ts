import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = skillSchema.safeParse(body);

    if (!parsed.success) {
      // Send readable error messages
      const errors = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 });
    }

    const { title, description } = parsed.data;

    const skill = await prisma.skill.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[SKILL_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: session.user.id },
      include: {
        tasks: true,
        reflections: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("[SKILL_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
