import Brand from "./Brand";
import Link from "next/link";

export default function DashboardNav({ role }: { role: "student" | "tutor" }) {
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Brand /><nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 sm:flex"><Link href={`/${role}/dashboard`} className="text-blue-600">Dashboard</Link><Link href="/" className="hover:text-blue-600">Help</Link><Link href="/login" className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">Log out</Link></nav><Link href="/login" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold sm:hidden">Log out</Link></div></header>;
}
