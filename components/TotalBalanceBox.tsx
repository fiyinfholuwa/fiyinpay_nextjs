import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({ totalBanks, totalCurrentBalance }: TotalaBalanceBoxProps) => (
  <section className="flex min-h-[180px] w-full items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:gap-7 sm:p-7">
    <DoughnutChart />
    <div className="flex-1">
      <div className="flex items-center justify-between gap-3"><strong className="text-lg">{totalBanks} Bank Accounts</strong><button className="border-0 bg-transparent p-0 text-xs font-bold text-blue-600">＋ Add bank</button></div>
      <p className="mb-1 mt-7 text-[13px] font-semibold text-slate-500">Total Current Balance</p>
      <div className="text-[32px] font-bold tracking-[-0.04em]"><AnimatedCounter amount={totalCurrentBalance} /></div>
    </div>
  </section>
);

export default TotalBalanceBox;
