import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FaBook } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdOutlineWatchLater } from "react-icons/md";
import { FcTodoList } from "react-icons/fc";
import Skills from "@/components/skills/skills";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="py-4">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        <div className="border rounded-xl p-5 shadow flex items-center justify-between">
          <div>
            <p className="text-neutral-500">Total Skills</p>
            <h1 className="text-3xl font-semibold">10</h1>
          </div>
          <div className="bg-primaryColor/10 p-2 rounded">
            <FaBook className="text-2xl text-primaryColor" />
          </div>
          
        </div>

        
        <div className="border rounded-xl p-5 shadow flex items-center justify-between">
          <div>
            <p className="text-neutral-500">Completed</p>
            <h1 className="text-3xl font-semibold">7</h1>
          </div>
          <div className="bg-green-500/10 p-2 rounded">
            <TiTick className="text-2xl text-white bg-green-500 rounded-full" />
          </div>
          
        </div>

        <div className="border rounded-xl p-5 shadow flex items-center justify-between">
          <div>
            <p className="text-neutral-500">In Progress</p>
            <h1 className="text-3xl font-semibold">5</h1>
          </div>
          <div className="bg-yellow-500/10 p-2 rounded">
            <MdOutlineWatchLater className="text-2xl bg-yellow-500 text-white p-1 rounded-full" />
          </div>
          
        </div>

        <div className="border rounded-xl p-5 shadow flex items-center justify-between">
          <div>
            <p className="text-neutral-500">Total Tasks</p>
            <h1 className="text-3xl font-semibold">47</h1>
          </div>
          <div className="bg-primaryColor/10 p-2 rounded">
            <FcTodoList className="text-2xl text-primaryColor" />
          </div>
          
        </div>



      </div>
      <Skills/>

    </main>
  );
}
