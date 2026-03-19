import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const reflectionSchema = z.object({
  skillId: z.string().min(1),
  content: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reflectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { skillId, content } = parsed.data;

    // Check ownership
    const skill = await prisma.skill.findUnique({
      where: { id: skillId, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const reflection = await prisma.reflection.create({
      data: { skillId, content },
    });

    return NextResponse.json(reflection, { status: 201 });
  } catch (error) {
    console.error("[CREATE_REFLECTION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get all reflections for a skill
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId");

    if (!skillId) {
      return NextResponse.json({ error: "Missing skillId" }, { status: 400 });
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const reflections = await prisma.reflection.findMany({
      where: { skillId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reflections, { status: 200 });
  } catch (error) {
    console.error("[GET_REFLECTIONS_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
