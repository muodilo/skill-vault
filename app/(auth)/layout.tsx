import { FaVault } from "react-icons/fa6";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return( 
  <section className="min-h-screen flex items-center justify-center px-4 flex-col">
    <div className="border p-2 bg-primaryColor rounded">
        <FaVault className="text-2xl text-white" />
    </div>
    <h1 className="text-3xl font-semibold  text-center text-gray-800">
      SkillVault </h1>
      <p className="text-neutral-500 mb-2">Track your learning jaurney</p>
    {children}
  </section>
)
}