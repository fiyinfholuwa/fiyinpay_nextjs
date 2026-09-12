const HeaderBox = ({ title, subtext, user }: HeaderBoxProps) => (
  <header className="mb-7">
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">Dashboard</p>
    <h1 className="m-0 text-[clamp(28px,3vw,38px)] font-bold leading-tight tracking-[-0.04em]">{title}<span className="text-blue-600"> {user}</span></h1>
    <p className="mt-2.5 text-[15px] text-slate-500">{subtext}</p>
  </header>
);

export default HeaderBox;
