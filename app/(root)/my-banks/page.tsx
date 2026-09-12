const banks = [
  { name: "Horizon Banking", holder: "ADRIAN HAJDIN", color: "ocean", spend: "$2,840.40", progress: "62%" },
  { name: "Bank of Australia", holder: "ADRIAN HAJDIN", color: "ocean", spend: "$2,840.40", progress: "74%" },
  { name: "Bank of India", holder: "ADRIAN HAJDIN", color: "ocean", spend: "$2,840.40", progress: "55%" },
  { name: "Bank of America", holder: "OLIVIA RHYE", color: "violet", spend: "$2,840.40", progress: "68%" },
  { name: "Bank of Canada", holder: "OLIVIA RHYE", color: "violet", spend: "$2,840.40", progress: "81%" },
  { name: "Bank of Pakistan", holder: "OLIVIA RHYE", color: "violet", spend: "$2,840.40", progress: "48%" },
];

export default function MyBanksPage() {
  return <main className="min-h-screen bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
    <header>
      <p className="eyebrow">My Banks</p>
      <h1 className="m-0 text-[31px] font-bold tracking-[-0.035em]">My Bank Accounts</h1>
      <p className="mt-2 text-sm text-slate-500">Effortlessly manage your banking activities</p>
    </header>
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between"><div><h2 className="m-0 text-[17px] font-semibold">Your cards</h2><p className="mt-1 text-xs text-slate-500">Connected accounts and monthly spending</p></div><button className="border-0 bg-transparent p-1 text-slate-400" aria-label="More options">•••</button></div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {banks.map((bank) => <article className="min-w-0" key={bank.name}>
          <div className={`relative h-[143px] overflow-hidden rounded-[14px] p-4 text-white shadow-[0_8px_15px_rgba(16,24,40,0.12)] ${bank.color === "ocean" ? "bg-gradient-to-br from-[#1684ff] to-[#408ef5]" : "bg-gradient-to-br from-[#5d35ff] to-[#7538e8]"}`}>
            <div className="relative z-10 flex justify-between gap-3 text-xs"><strong>{bank.name}</strong><span className="rounded bg-white/25 px-1.5 py-0.5 text-[11px]">▣</span></div>
            <div className="absolute inset-[38px_-20px_0] rotate-[-9deg] scale-110 bg-[repeating-radial-gradient(ellipse_at_10%_100%,transparent_0_10px,#fff_11px_12px,transparent_13px_19px)] opacity-20" />
            <div className="absolute bottom-[35px] left-4 right-4 z-10 flex justify-between text-[9px] tracking-[.06em]"><span>{bank.holder}</span><span>06/24</span></div>
            <div className="absolute bottom-3 left-4 right-4 z-10 text-xs tracking-[.12em]">1234 1234 1234 1234 <span className="float-right text-[17px] tracking-[-5px] text-orange-500">●●</span></div>
          </div>
          <div className="mt-2.5 flex justify-between gap-2 text-[11px] text-slate-500"><span>Spending this month</span><strong className="font-normal">{bank.spend}</strong></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><i className={`block h-full rounded-full ${bank.color === "ocean" ? "bg-[#2e90fa]" : "bg-[#6538ff]"}`} style={{ width: bank.progress }} /></div>
        </article>)}
      </div>
    </section>
  </main>;
}
