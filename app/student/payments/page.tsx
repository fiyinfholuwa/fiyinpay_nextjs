"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Transaction = { id: string; description?: string | null; amount: number | string; type: string; status: string; createdAt: string };

export default function PaymentsPage() {
  return (
    <PaymentsContent />
  );
}

function PaymentsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    authorizedApi<{ transactions: Transaction[] }>("/wallet")
      .then((wallet) => setTransactions(wallet.transactions))
      .catch((error) => setMessage(error.message));
  }, []);
  return (
    <WorkspacePage
      eyebrow="Student workspace"
      title="Payment history"
      description="Review your lesson payments and wallet activity."
    >
      <Section title="Recent payments">
        <div className="divide-y divide-slate-100">
          {transactions.map((payment) => (
            <div
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              key={payment.id}
            >
              <div>
                <strong className="block text-sm">{payment.description ?? payment.type.replaceAll("_", " ")}</strong>
                <span className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <strong className="block text-sm">
                  NGN {Number(payment.amount).toLocaleString()}
                </strong>
                <span
                  className={`text-xs font-semibold ${payment.status === "SUCCESS" ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
          {!transactions.length && <p className="py-4 text-sm text-slate-500">{message || "No payment activity yet."}</p>}
        </div>
      </Section>
    </WorkspacePage>
  );
}
