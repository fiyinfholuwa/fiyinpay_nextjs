import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const transactions = [
  { name: "Spotify", amount: "-$15.00", status: "Processing", date: "Wed 1:00pm", category: "Subscriptions", tone: "green", icon: "S" },
  { name: "Alexa Doe", amount: "+$88.00", status: "Success", date: "Wed 2:45am", category: "Deposit", tone: "blue", icon: "A" },
  { name: "Figma", amount: "-$18.99", status: "Processing", date: "Tue 6:10pm", category: "Income", tone: "dark", icon: "F" },
  { name: "Fresh F&V", amount: "-$88.00", status: "Success", date: "Tue 12:15pm", category: "Groceries", tone: "pale", icon: "FV" },
  { name: "Sam Sulek", amount: "-$40.20", status: "Declined", date: "Tue 5:40am", category: "Food", tone: "pink", icon: "S" },
];

const budgets = [
  { name: "Subscriptions", amount: "$25 left", width: "76%", color: "blue" },
  { name: "Food and booze", amount: "$120 left", width: "62%", color: "pink" },
  { name: "Savings", amount: "$50 left", width: "88%", color: "green" },
];

const toneClasses: Record<string, string> = {
  green: "bg-emerald-400", blue: "bg-sky-400", dark: "bg-slate-900", pale: "bg-slate-100 text-slate-500", pink: "bg-pink-500",
};

export default function Home() {
  return <section className="grid min-h-screen grid-cols-1 bg-slate-50 xl:grid-cols-[minmax(0,1fr)_300px]">
    <div className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <HeaderBox title="Welcome," subtext="Access and manage your account and transactions efficiently." user="Adrian" />
      <TotalBalanceBox totalBanks={2} totalCurrentBalance={2698.12} />
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><h2 className="m-0 text-[22px] font-bold tracking-tight">Recent transactions</h2><p className="mt-1.5 text-[13px] text-slate-500">Your latest activity across all accounts</p></div><button className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700">View all</button></div>
        <div className="mt-6 flex gap-6 overflow-x-auto border-b border-slate-200"><button className="whitespace-nowrap border-b-2 border-blue-600 pb-3 text-xs font-bold text-blue-600">Chase Bank</button><button className="whitespace-nowrap pb-3 text-xs font-bold text-slate-400">Bank of America</button><button className="whitespace-nowrap pb-3 text-xs font-bold text-slate-400">First Platypus Bank</button></div>
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 p-3.5"><span className="grid size-[34px] place-items-center rounded-full bg-blue-600 text-[11px] font-extrabold text-white">CB</span><div className="flex flex-col gap-0.5"><strong className="text-sm">Chase Bank</strong><span className="text-xs font-bold text-blue-600">$2,588.12</span></div><span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Savings</span></div>
        <div className="mt-3 overflow-x-auto"><div className="grid min-w-[680px] grid-cols-[1.5fr_.8fr_1fr_1fr_1.05fr] gap-x-3.5 px-3 py-2 text-[10px] font-bold uppercase text-slate-400"><span>Transaction</span><span>Amount</span><span>Status</span><span>Date</span><span>Category</span></div>{transactions.map((item) => <div className="grid min-w-[680px] grid-cols-[1.5fr_.8fr_1fr_1fr_1.05fr] items-center gap-x-3.5 border-t border-slate-100 px-3 py-2 text-xs text-slate-500" key={item.name}><div className="flex items-center gap-2.5 text-slate-700"><span className={`grid size-[30px] place-items-center rounded-full text-[10px] font-extrabold text-white ${toneClasses[item.tone]}`}>{item.icon}</span><strong>{item.name}</strong></div><strong className={item.amount.startsWith("+") ? "text-emerald-600" : "text-red-500"}>{item.amount}</strong><span className={`w-max rounded-full px-2 py-1 text-[10px] font-bold ${item.status === "Success" ? "bg-emerald-50 text-emerald-600" : item.status === "Declined" ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"}`}>{item.status}</span><span>{item.date}</span><span className="w-max rounded-full border border-blue-500 px-2 py-1 text-[10px] font-bold text-blue-600">{item.category}</span></div>)}</div>
      </section>
    </div>
    <aside className="hidden border-l border-slate-200 bg-white xl:block"><div className="h-[132px] bg-[radial-gradient(circle_at_28%_22%,#ffb4cd,transparent_45%),linear-gradient(135deg,#b6dcff,#d9b5ff_70%,#ffd1e5)]" /><div className="border-b border-slate-200 px-6 pb-6"><div className="-mt-8 grid size-[70px] place-items-center rounded-full border-[5px] border-white bg-blue-50 text-xl font-bold text-blue-600 shadow-lg">AH</div><h2 className="mt-3.5 text-xl font-bold">Adrian Hajdin</h2><p className="mt-1 text-[13px] text-slate-500">adrian@horizon.app</p></div><div className="border-b border-slate-200 px-6 py-6"><div className="flex items-center justify-between"><h3 className="text-[15px] font-bold">My banks</h3><button className="border-0 bg-transparent text-xs font-bold text-blue-600">＋ Add bank</button></div><div className="relative mt-5 h-36"><div className="absolute left-0 top-0 z-10 h-28 w-48 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 p-4 text-xs font-bold text-white shadow-lg">Horizon Banking</div><div className="absolute left-8 top-6 h-28 w-48 rounded-xl bg-gradient-to-br from-pink-300 to-indigo-300 p-4 text-xs font-bold text-white shadow-lg">Bank of America</div></div></div><div className="px-6 py-6"><div className="flex items-center justify-between"><h3 className="text-[15px] font-bold">My budgets</h3><button className="border-0 bg-transparent text-xs text-slate-400">•••</button></div>{budgets.map((budget) => <div className={`mt-4 rounded-xl p-3 ${budget.color === "pink" ? "bg-pink-50" : budget.color === "green" ? "bg-emerald-50" : "bg-blue-50"}`} key={budget.name}><div className="flex justify-between gap-2 text-[11px]"><strong>{budget.name}</strong><span className="text-slate-500">{budget.amount}</span></div><div className={`mt-2.5 h-1.5 overflow-hidden rounded-full ${budget.color === "pink" ? "bg-pink-200" : budget.color === "green" ? "bg-emerald-200" : "bg-blue-200"}`}><i className={`block h-full rounded-full ${budget.color === "pink" ? "bg-pink-600" : budget.color === "green" ? "bg-emerald-600" : "bg-blue-600"}`} style={{ width: budget.width }} /></div></div>)}</div></aside>
  </section>;
}
