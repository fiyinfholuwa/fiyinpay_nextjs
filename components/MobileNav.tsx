"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <>
    <button className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white" onClick={() => setOpen(true)} aria-label="Open navigation">
      <span className="flex flex-col gap-1"><i className="block h-0.5 w-5 bg-slate-700" /><i className="block h-0.5 w-5 bg-slate-700" /><i className="block h-0.5 w-5 bg-slate-700" /></span>
    </button>
    {open && <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={() => setOpen(false)}>
      <aside className="h-full w-[280px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-10 flex items-center justify-between"><Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-[#00214f]" onClick={() => setOpen(false)}><Image src="/icons/logo.svg" width={30} height={30} alt="Horizon logo" />Horizon</Link><button className="text-2xl text-slate-500" onClick={() => setOpen(false)} aria-label="Close navigation">×</button></div>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((item) => {
            const active = pathname === item.route || (item.route !== "/" && pathname.startsWith(`${item.route}/`));
            return <Link href={item.route} key={item.label} onClick={() => setOpen(false)} className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${active ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-slate-700 hover:bg-slate-100"}`}><Image src={item.imgURL} width={22} height={22} alt="" className={active ? "brightness-0 invert" : "opacity-70"} />{item.label}</Link>;
          })}
          <Link href="#connect-bank" onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"><Image src="/icons/connect-bank.svg" width={22} height={22} alt="" className="opacity-70" />Connect bank</Link>
        </nav>
      </aside>
    </div>}
  </>;
};

export default MobileNav;
