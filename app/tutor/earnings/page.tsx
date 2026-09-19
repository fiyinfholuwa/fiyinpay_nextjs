"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Earnings = {
  balance: number | string;
  currency: string;
  transactions: {
    id: string;
    amount: number | string;
    createdAt: string;
    description?: string | null;
  }[];
};
type Payout = {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  processedAt?: string | null;
};

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [amount, setAmount] = useState("");
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [message, setMessage] = useState("");

  function load() {
    Promise.all([
      authorizedApi<Earnings>("/tutors/me/earnings"),
      authorizedApi<Payout[]>("/wallet/payouts/me"),
    ])
      .then(([currentEarnings, currentPayouts]) => {
        setEarnings(currentEarnings);
        setPayouts(currentPayouts);
      })
      .catch(() => setMessage("Unable to load earnings information."));
  }

  useEffect(() => {
    load();
  }, []);

  async function requestPayout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestingPayout(true);
    try {
      await authorizedApi("/wallet/payouts", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      setMessage("Payout request submitted for admin review.");
      setPayoutModalOpen(false);
      setAmount("");
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to request payout");
    } finally {
      setRequestingPayout(false);
    }
  }

  const availableBalance = Number(earnings?.balance ?? 0);
  return (
    <WorkspacePage
      eyebrow="Tutor workspace"
      title="Earnings"
      description="Track your lesson income and payouts."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-600 p-5 text-white">
          <span className="text-sm text-emerald-100">Available</span>
          <strong className="mt-3 block text-3xl">
            {earnings?.currency ?? "NGN"}{" "}
            {Number(earnings?.balance ?? 0).toLocaleString()}
          </strong>
          <button
            type="button"
            disabled={availableBalance <= 0}
            className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              setAmount(availableBalance.toString());
              setPayoutModalOpen(true);
              setMessage("");
            }}
          >
            Request payout
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-sm text-slate-500">This month</span>
          <strong className="mt-3 block text-3xl">
            {earnings?.currency ?? "NGN"}{" "}
            {earnings?.transactions
              .reduce((total, item) => total + Number(item.amount), 0)
              .toLocaleString() ?? "0"}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-sm text-slate-500">Platform pay cut</span>
          <strong className="mt-3 block text-3xl">10%</strong>
        </div>
      </div>
      <div className="mt-6">
        {message && <p className="mb-5 text-sm text-slate-500">{message}</p>}
        <Section title="Payout history">
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                key={payout.id}
              >
                <div>
                  <strong className="block">NGN {Number(payout.amount).toLocaleString()}</strong>
                  <span className="text-xs text-slate-500">Requested {new Date(payout.createdAt).toLocaleString()}</span>
                </div>
                <span className="w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase text-blue-700">{payout.status}</span>
              </div>
            ))}
            {!payouts.length && <p className="text-sm text-slate-500">No payout requests yet.</p>}
          </div>
        </Section>
      </div>
      {payoutModalOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-5" onClick={() => setPayoutModalOpen(false)}>
          <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Withdraw earnings</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Request a payout</h2>
              </div>
              <button type="button" onClick={() => setPayoutModalOpen(false)} className="text-2xl leading-none text-slate-400" aria-label="Close payout dialog">×</button>
            </div>
            <p className="mt-3 text-sm text-slate-500">Available balance: <strong className="text-slate-700">{earnings?.currency ?? "NGN"} {availableBalance.toLocaleString()}</strong></p>
            <form onSubmit={requestPayout} className="mt-5">
              <label className="text-sm font-semibold text-slate-700">Amount to withdraw<input required min="1" max={availableBalance} step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
              <button type="submit" disabled={requestingPayout || Number(amount) <= 0 || Number(amount) > availableBalance} className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{requestingPayout ? "Submitting..." : "Submit payout request"}</button>
            </form>
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
