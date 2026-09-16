"use client";

import { FormEvent, useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";
import Toast, { ToastData } from "@/components/ui/Toast";

type Wallet = { balance: number | string; currency: string };

export default function FundWalletModal({
  emailVerified = true,
}: {
  emailVerified?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [funding, setFunding] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const load = () =>
    authorizedApi<Wallet>("/wallet")
      .then(setWallet)
      .catch(() => undefined);
  useEffect(() => {
    load();
  }, []);

  async function fundWallet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFunding(true);
    setMessage("");
    try {
      const result = await authorizedApi<{
        checkoutUrl: string | null;
        message?: string;
      }>("/wallet/fund", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      if (result.checkoutUrl) window.location.href = result.checkoutUrl;
      else
        setMessage(
          result.message ?? "Paystack checkout is not configured yet.",
        );
      setAmount("");
      load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to fund wallet",
      );
    } finally {
      setFunding(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-lg shadow-blue-100">
        <p className="text-sm text-blue-100">Wallet balance</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <strong className="text-3xl">
            {wallet?.currency ?? "NGN"}{" "}
            {Number(wallet?.balance ?? 0).toLocaleString()}
          </strong>
          <button
            onClick={() =>
              emailVerified
                ? setOpen(true)
                : setToast({
                    type: "error",
                    title: "",
                    message: "Verify your email before making payments.",
                  })
            }
            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            Fund wallet
          </button>
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-5"
          onClick={() => setOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Wallet
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add funds
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-slate-400"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Funds are processed securely through Paystack.
            </p>
            <form onSubmit={fundWallet} className="mt-5">
              <label className="text-sm font-semibold text-slate-700">
                Amount
                <input
                  autoFocus
                  required
                  min="100"
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="5000"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              {message && (
                <p className="mt-3 text-sm text-amber-700">{message}</p>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={funding}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {funding ? "Opening checkout..." : "Continue to payment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
