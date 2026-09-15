"use client";

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

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    authorizedApi<Earnings>("/tutors/me/earnings")
      .then(setEarnings)
      .catch(() => undefined);
  }, []);
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
        <button
          type="button"
          className="mb-5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          onClick={async () => {
            try {
              await authorizedApi("/wallet/payouts", {
                method: "POST",
                body: JSON.stringify({
                  amount: Number(earnings?.balance ?? 0),
                }),
              });
              setMessage("Payout request submitted for admin review.");
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "Unable to request payout",
              );
            }
          }}
        >
          Request payout
        </button>
        {message && <p className="mb-5 text-sm text-slate-500">{message}</p>}
        <Section title="Recent payouts">
          <div className="space-y-3">
            {earnings?.transactions.map((transaction) => (
              <div
                className="flex justify-between rounded-xl bg-slate-50 p-4 text-sm"
                key={transaction.id}
              >
                <span>{transaction.description ?? "Tutor earning"}</span>
                <strong>
                  NGN {Number(transaction.amount).toLocaleString()}
                </strong>
              </div>
            )) ?? (
              <p className="text-sm text-slate-500">
                Your earnings will appear here.
              </p>
            )}
          </div>
        </Section>
      </div>
    </WorkspacePage>
  );
}
