import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateReflectionSchema = z.object({
  content: z.string().min(1),
});

// Get single reflection
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const reflection = await prisma.reflection.findUnique({
      where: { id },
      include: { skill: true },
    });

    if (!reflection || reflection.skill.userId !== session.user.id) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    return NextResponse.json(reflection, { status: 200 });
  } catch (error) {
    console.error("[GET_REFLECTION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update reflection
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = updateReflectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const reflection = await prisma.reflection.findUnique({
      where: { id },
      include: { skill: true },
    });

    if (!reflection || reflection.skill.userId !== session.user.id) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    const updated = await prisma.reflection.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_REFLECTION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete reflection
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const reflection = await prisma.reflection.findUnique({
      where: { id },
      include: { skill: true },
    });

    if (!reflection || reflection.skill.userId !== session.user.id) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    await prisma.reflection.delete({ where: { id } });

    return NextResponse.json({ message: "Reflection deleted" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_REFLECTION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
