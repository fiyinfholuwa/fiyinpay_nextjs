'use client';

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();

  return <aside className="sticky left-0 top-0 hidden min-h-screen w-[272px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-5 pb-[22px] pt-7 md:flex">
    <div>
      <Link href="/" className="mb-[52px] ml-3 flex items-center gap-2.5 font-serif text-[27px] font-bold text-[#00214f]">
        <Image src="/icons/logo.svg" width={32} height={32} alt="Horizon logo" />
        <span>Horizon</span>
      </Link>
      <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
        {sidebarLinks.map((item) => {
          const active = pathname === item.route || (item.route !== "/" && pathname.startsWith(`${item.route}/`));
          return <Link href={item.route} key={item.label} className={`flex min-h-12 items-center gap-3 rounded-[10px] px-3.5 text-[15px] font-semibold transition-colors hover:bg-slate-100 ${active ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md" : "text-slate-700"}`}>
            <Image className={active ? "brightness-0 invert" : "opacity-70"} src={item.imgURL} width={22} height={22} alt="" />
            <span>{item.label}</span>
          </Link>;
        })}
        <Link href="#connect-bank" className="flex min-h-12 items-center gap-3 rounded-[10px] px-3.5 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-slate-100">
          <Image src="/icons/connect-bank.svg" width={22} height={22} alt="" />
          <span>Connect bank</span>
        </Link>
      </nav>
    </div>
    <Footer user={user} />
  </aside>;
}

export default Sidebar;
