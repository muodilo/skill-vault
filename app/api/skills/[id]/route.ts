import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const skillUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export async function GET(req: Request, context: { params:Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const skillId = params.id;

    const skill = await prisma.skill.findUnique({
      where: { id: skillId, userId: session.user.id },
      include: { tasks: true, reflections: true },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("[GET_SKILL_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const skillId = params.id;
    const body = await req.json();
    const parsed = skillUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message).join(", ");
      return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 });
    }

    const updatedSkill = await prisma.skill.updateMany({
      where: { id: skillId, userId: session.user.id },
      data: parsed.data,
    });

    if (updatedSkill.count === 0) {
      return NextResponse.json({ error: "Skill not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill updated successfully" });
  } catch (error) {
    console.error("[UPDATE_SKILL_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await context.params;
    const skillId = params.id;

    const deleted = await prisma.skill.deleteMany({
      where: { id: skillId, userId: session.user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Skill not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("[DELETE_SKILL_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
