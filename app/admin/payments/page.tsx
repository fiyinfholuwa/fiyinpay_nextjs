"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Payout = {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  tutor: { firstName: string; lastName: string; email: string; bankAccount?: { bankName: string; accountName: string; accountNumber: string } | null };
};

export default function AdminPayments() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [message, setMessage] = useState("");
  const load = () =>
    authorizedApi<Payout[]>("/wallet/admin/payouts")
      .then(setPayouts)
      .catch((error) => setMessage(error.message));
  useEffect(() => {
    load();
  }, []);

  async function update(
    id: string,
    status: "PROCESSING" | "PAID" | "REJECTED",
  ) {
    try {
      await authorizedApi(`/wallet/admin/payouts/${id}/${status}`, {
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update payout",
      );
    }
  }

  return (
    <WorkspacePage
      eyebrow="Admin workspace"
      title="Payments"
      description="Review and process tutor payout requests."
    >
      <Section title="Payout requests">
        <div className="space-y-3">
          {payouts.map((payout) => (
            <div
              className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={payout.id}
            >
              <div>
                <strong className="block text-sm">
                  {payout.tutor.firstName} {payout.tutor.lastName}
                </strong>
                <span className="text-xs text-slate-500">
                  {payout.tutor.email} ·{" "}
                  {new Date(payout.createdAt).toLocaleDateString()}
                </span>
                <span className="mt-2 block text-xs text-slate-600">
                  {payout.tutor.bankAccount
                    ? `${payout.tutor.bankAccount.bankName} · ${payout.tutor.bankAccount.accountName} · ${payout.tutor.bankAccount.accountNumber}`
                    : "Bank details not added"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <strong className="text-sm">
                  NGN {Number(payout.amount).toLocaleString()}
                </strong>
                <span className="text-xs font-semibold text-slate-500">
                  {payout.status}
                </span>
                {payout.status === "REQUESTED" && (
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                    onClick={() => update(payout.id, "PAID")}
                  >
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}
          {!payouts.length && (
            <p className="text-sm text-slate-500">
              {message || "No payout requests yet."}
            </p>
          )}
        </div>
      </Section>
    </WorkspacePage>
  );
}
