"use client";

import Brand from "./Brand";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";
import Toast, { ToastData } from "@/components/ui/Toast";

const links = {
  student: [
    ["Dashboard", "/student/dashboard"],
    ["Find a tutor", "/student/tutors"],
    ["My subscriptions", "/student/subscriptions"],
    ["Payment history", "/student/payments"],
    ["Assignments", "/student/assignments"],
    ["Profile", "/student/profile"],
  ],
  tutor: [
    ["Dashboard", "/tutor/dashboard"],
    ["My profile", "/tutor/profile"],
    ["My students", "/tutor/students"],
    ["Schedule", "/tutor/schedule"],
    ["Assignments", "/tutor/assignments"],
    ["Earnings", "/tutor/earnings"],
  ],
  admin: [
    ["Overview", "/admin/dashboard"],
    ["Users", "/admin/users"],
    ["Payments", "/admin/payments"],
    ["Pay cut", "/admin/settings"],
  ],
} as const;

export default function AppShell({
  role,
  children,
}: {
  role: "student" | "tutor" | "admin";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; emailVerified: boolean } | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  useEffect(() => {
    authorizedApi<{ email: string; emailVerified: boolean }>("/auth/me")
      .then(setUser)
      .catch(() => router.replace("/login"));
  }, [router]);

  const logout = () => {
    window.localStorage.removeItem("daralearn-access-token");
    router.push("/login");
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <Brand />
        <p className="mb-3 mt-10 text-xs font-bold uppercase tracking-wider text-slate-400">
          {role} workspace
        </p>
        <nav className="space-y-1">
          {links[role].map(([label, href]) => (
            user && !user.emailVerified && href !== `/${role}/dashboard` ? <button key={href} type="button" onClick={() => setToast({ type: "error", title: "", message: "Verify your email before opening this section." })} className="flex w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-400 hover:bg-red-50 hover:text-red-800">{label}</button> : <Link key={href} href={href} className={`flex rounded-xl px-3 py-3 text-sm font-semibold ${pathname === href ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{label}</Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-5">
          <button type="button" onClick={logout} className="text-sm font-semibold text-slate-500 hover:text-blue-600">
            Log out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Toast toast={toast} onClose={() => setToast(null)} />
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
          <Brand />
          <button type="button" onClick={logout} className="text-xs font-semibold text-slate-500">
            Log out
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
