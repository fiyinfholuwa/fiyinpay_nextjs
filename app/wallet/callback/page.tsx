"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";

type PaymentState = "loading" | "success" | "error";

export default function WalletCallbackPage() {
  const [state, setState] = useState<PaymentState>("loading");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");

    if (!reference) {
      setState("error");
      setMessage("We could not find the payment reference.");
      return;
    }

    authorizedApi<{ status?: string }>("/wallet/verify", {
      method: "POST",
      body: JSON.stringify({ reference }),
    })
      .then(() => {
        setState("success");
        setMessage("Your wallet has been funded successfully.");
      })
      .catch((error) => {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not confirm your payment.",
        );
      });
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" aria-label="Loading" />
        )}
        {state === "success" && (
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700" aria-hidden="true">
            ✓
          </div>
        )}
        {state === "error" && (
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-red-100 text-xl font-bold text-red-700" aria-hidden="true">
            !
          </div>
        )}
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          {state === "loading" ? "Confirming payment" : state === "success" ? "Payment successful" : "Payment not confirmed"}
        </h1>
        <p className={`mt-3 text-sm leading-6 ${state === "error" ? "text-red-700" : "text-slate-500"}`}>
          {message}
        </p>
        {state !== "loading" && (
          <Link href="/student/dashboard" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
            Return to dashboard
          </Link>
        )}
      </section>
    </main>
  );
}
