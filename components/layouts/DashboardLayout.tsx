"use client";

import { useState } from "react";
import { FiMenu, FiHome, FiGrid, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { FaVault } from "react-icons/fa6";
import Link from "next/link";
import { NavItem } from "../nav-items";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
  signOut({ callbackUrl: '/' });
};


  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "bg-slate-100  transition-all duration-300 flex flex-col justify-between",
          "fixed inset-y-0 left-0 z-40 transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "w-64",
          collapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4 ">
            <Link href={'/dashboard'} className="flex items-center gap-2">
              <div className="border p-2 bg-primaryColor rounded">
                <FaVault className=" text-white" />
              </div>
              {collapsed? null :<p className="text-xl font-bold">SkillVault</p>}
              
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:inline-block text-slate-500"
              >
                {collapsed ? "»" : "«"}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-500 lg:hidden"
              >
                ✕
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem
              icon={<FiHome />}
              label="Dashboard"
              collapsed={collapsed}
              href="/dashboard"
            />
            <NavItem 
            icon={<FiGrid />} 
            label="Skills" 
            collapsed={collapsed} 
            href="/dashboard"
            />
          </nav>
        </div>

        <div className="p-4 border-t ">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-2 "
          >
            <FiLogOut className="text-xl" />
            <span
              className={cn(
                "inline-block",
                collapsed ? "lg:hidden" : "lg:inline-block"
              )}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50  lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 bg-white border-b px-4 flex items-center gap-2 lg:justify-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-gray-700 lg:hidden"
          >
            <FiMenu />
          </button>
          <Link href={'/dashboard'} className="flex items-center gap-2 lg:hidden">
              <div className="border p-2 bg-primaryColor rounded">
                <FaVault className=" text-white" />
              </div>
              {collapsed? null :<p className="text-xl font-bold">SkillVault</p>}
              
            </Link>
            <input type="text" placeholder="Search Skill" className="border px-5 py-2 rounded-xl"/>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}


