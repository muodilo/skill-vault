
import SkillDetail from "@/components/SkillDetail";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SkillPage({ params }: { params: { id: string } }) {
      const session = await auth();
    
      if (!session?.user) {
        redirect("/");
      }
  return <SkillDetail skillId={params.id} />;
}
