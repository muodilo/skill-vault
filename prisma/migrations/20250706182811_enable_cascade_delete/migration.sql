-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_skillId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
