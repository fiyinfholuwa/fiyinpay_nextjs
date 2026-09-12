import Image from "next/image";

const Footer = ({ user }: FooterProps) => (
  <footer className="flex items-center gap-2.5 border-t border-slate-200 pt-[18px]">
    <div className="grid size-[38px] shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">{user?.firstName?.[0]}</div>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <strong className="truncate text-[13px]">{user?.firstName} {user?.lastName}</strong>
      <span className="truncate text-[11px] text-slate-500">{user?.email || "adrian@horizon.app"}</span>
    </div>
    <button className="grid place-items-center border-0 bg-transparent p-1" aria-label="Log out">
      <Image src="/icons/logout.svg" width={20} height={20} alt="" />
    </button>
  </footer>
);

export default Footer;
