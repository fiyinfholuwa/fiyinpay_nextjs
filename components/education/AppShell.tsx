"use client";

import Brand from "./Brand";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";
import Toast, { ToastData } from "@/components/ui/Toast";

type IconName = "dashboard" | "search" | "subscription" | "payment" | "assignment" | "profile" | "students" | "calendar" | "earnings" | "users" | "settings";

const links = {
  student: [
    ["Dashboard", "/student/dashboard", "dashboard"],
    ["Find a tutor", "/student/tutors", "search"],
    ["My subscriptions", "/student/subscriptions", "subscription"],
    ["Payment history", "/student/payments", "payment"],
    ["Assignments", "/student/assignments", "assignment"],
    ["Profile", "/student/profile", "profile"],
  ],
  tutor: [
    ["Dashboard", "/tutor/dashboard", "dashboard"],
    ["My profile", "/tutor/profile", "profile"],
    ["My students", "/tutor/students", "students"],
    ["Schedule", "/tutor/schedule", "calendar"],
    ["Assignments", "/tutor/assignments", "assignment"],
    ["Earnings", "/tutor/earnings", "earnings"],
  ],
  admin: [
    ["Overview", "/admin/dashboard", "dashboard"],
    ["Users", "/admin/users", "users"],
    ["Payments", "/admin/payments", "payment"],
    ["Platform Settings", "/admin/settings", "settings"],
  ],
} as const;

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    subscription: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    payment: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    assignment: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h4M9 13h6M9 17h6" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    students: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20a6 6 0 0 1 12 0M15 16a5 5 0 0 1 6 4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    earnings: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20a6 6 0 0 1 12 0M15 16a5 5 0 0 1 6 4" /></>,
    settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">{paths[name]}</svg>;
}

export default function AppShell({
  role,
  children,
}: {
  role: "student" | "tutor" | "admin";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; emailVerified: boolean; role: string } | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    authorizedApi<{ email: string; emailVerified: boolean; role: string }>("/auth/me")
      .then((currentUser) => {
        if (currentUser.role !== role.toUpperCase()) {
          window.localStorage.removeItem("daralearn-access-token");
          router.replace(role === "admin" ? "/admin/login" : "/login");
          return;
        }
        setUser(currentUser);
      })
      .catch(() => router.replace(role === "admin" ? "/admin/login" : "/login"));
  }, [router]);

  const logout = () => {
    window.localStorage.removeItem("daralearn-access-token");
    router.push(role === "admin" ? "/admin/login" : "/login");
  };
  const renderNavigation = () => (
    <nav className="space-y-1">
      {links[role].map(([label, href, icon]) => user && !user.emailVerified && href !== `/${role}/dashboard` ? <button key={href} type="button" onClick={() => setToast({ type: "error", title: "", message: "Verify your email before opening this section." })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-400 hover:bg-red-50 hover:text-red-800"><NavIcon name={icon} />{label}</button> : <Link key={href} href={href} onClick={() => setMobileNavOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${pathname === href ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}><NavIcon name={icon} />{label}</Link>)}
    </nav>
  );
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <Brand />
        <p className="mb-3 mt-10 text-xs font-bold uppercase tracking-wider text-slate-400">
          {role} workspace
        </p>
        {renderNavigation()}
        <div className="mt-auto border-t border-slate-200 pt-5">
          <button type="button" onClick={logout} className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-blue-600">
            <span aria-hidden="true">↪</span>
            Log out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Toast toast={toast} onClose={() => setToast(null)} />
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
          <Brand />
          <button type="button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100">
            {mobileNavOpen ? <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </header>
        {mobileNavOpen && <div className="fixed inset-0 z-40 bg-slate-950/30 md:hidden" onClick={() => setMobileNavOpen(false)}>
          <aside className="fixed inset-y-0 left-0 h-full w-72 overflow-y-auto bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between"><Brand /><button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{role} workspace</p>
            {renderNavigation()}
            <button type="button" onClick={logout} className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-500">↪ Log out</button>
          </aside>
        </div>}
        {children}
      </div>
    </div>
  );
}
