import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { skill: true },
    });

    if (!task || task.skill.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }


    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("[TOGGLE_TASK_COMPLETED_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
