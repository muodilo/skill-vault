
import SkillDetail from "@/components/SkillDetail";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SkillPage(context: { params:Promise<{ id: string }> }) {
      const session = await auth();
      const params = await context.params;
    
      if (!session?.user) {
        redirect("/");
      }
  return <SkillDetail skillId={params.id} />;
}
