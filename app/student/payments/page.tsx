"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Transaction = {
  id: string;
  description?: string | null;
  amount: number | string;
  type: string;
  status: string;
  createdAt: string;
};

const pageSize = 10;

function statusClass(status: string) {
  if (status === "SUCCESS") return "bg-emerald-50 text-emerald-700";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function formatType(type: string) {
  return type.replaceAll("_", " ");
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    authorizedApi<{ transactions: Transaction[] }>("/wallet")
      .then((wallet) => setTransactions(wallet.transactions))
      .catch((error) => setMessage(error.message));
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transactions;

    return transactions.filter((payment) => {
      const searchable = [
        payment.description ?? "",
        payment.type,
        payment.status,
        payment.amount,
        new Date(payment.createdAt).toLocaleDateString(),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [search, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const visibleTransactions = useMemo(
    () => filteredTransactions.slice((page - 1) * pageSize, page * pageSize),
    [filteredTransactions, page],
  );

  return (
    <WorkspacePage
      eyebrow="Student workspace"
      title="Payment history"
      description="Review your lesson payments and wallet activity."
    >
      <Section
        title="Recent payments"
        description={`${filteredTransactions.length} of ${transactions.length} transaction${transactions.length === 1 ? "" : "s"}`}
      >
        {filteredTransactions.length ? (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="sr-only" htmlFor="payment-search">Search payment history</label>
              <input
                id="payment-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search payments"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-xs"
              />
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Description</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 text-right font-bold">Amount</th>
                    <th className="px-4 py-3 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {visibleTransactions.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {payment.description ?? formatType(payment.type)}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {formatType(payment.type)}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-800">
                        NGN {Number(payment.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredTransactions.length)} of {filteredTransactions.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            {transactions.length ? "No matching payments." : message || "No payment activity yet."}
          </p>
        )}
      </Section>
    </WorkspacePage>
  );
}
