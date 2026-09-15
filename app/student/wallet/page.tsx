"use client";
import { FormEvent, useEffect, useState } from "react";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Wallet = { balance: number | string; currency: string; transactions: { id: string; amount: number | string; type: string; status: string; createdAt: string }[] };

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const loadWallet = () => authorizedApi<Wallet>("/wallet").then(setWallet).catch((error) => setMessage(error.message));
  useEffect(() => { loadWallet(); }, []);

  const fund = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      const result = await authorizedApi<{ checkoutUrl: string | null; message?: string }>("/wallet/fund", { method: "POST", body: JSON.stringify({ amount: Number(amount) }) });
      if (result.checkoutUrl) window.location.href = result.checkoutUrl;
      else setMessage(result.message ?? "Paystack checkout is ready to configure.");
      setAmount("");
      loadWallet();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to fund wallet");
    }
  };
  return (
    <WorkspacePage
      eyebrow="Student workspace"
      title="Fund your wallet"
      description="Keep funds available for upcoming lessons."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-blue-600 p-7 text-white">
          <span className="text-sm text-blue-100">Available balance</span>
          <strong className="mt-3 block text-4xl">{wallet?.currency ?? "NGN"} {Number(wallet?.balance ?? 0).toLocaleString()}</strong>
        </div>
        <form
          onSubmit={fund}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="text-sm font-semibold">
            Amount to add
            <input
              required
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-blue-500"
              placeholder="50"
            />
          </label>
          <button className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">
            Fund with Paystack
          </button>
          {message && <p className="mt-3 text-sm text-slate-500">{message}</p>}
        </form>
      </div>
    </WorkspacePage>
  );
}
