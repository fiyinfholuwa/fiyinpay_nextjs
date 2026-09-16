"use client";

import { FormEvent, useState } from "react";
import { authorizedApi, saveAccessToken } from "@/lib/api";
import Toast, { ToastData } from "@/components/ui/Toast";

type EmailVerificationGateProps = {
  email: string;
  onVerified: () => void;
};

export default function EmailVerificationGate({ email, onVerified }: EmailVerificationGateProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await authorizedApi<{ accessToken: string; message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      saveAccessToken(result.accessToken);
      setOpen(false);
      setCode("");
      onVerified();
      setToast({ type: "success", title: "Email verified", message: result.message });
    } catch (error) {
      setToast({ type: "error", title: "", message: error instanceof Error ? error.message : "Unable to verify email" });
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setResending(true);
    try {
      const result = await authorizedApi<{ message: string }>("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setToast({ type: "success", title: "Verification code sent", message: result.message });
    } catch (error) {
      setToast({ type: "error", title: "", message: error instanceof Error ? error.message : "Unable to resend code" });
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="border-b border-red-200 bg-red-50 px-5 py-4 sm:px-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-red-950">Your email has not been verified</p>
            <p className="mt-1 text-sm text-red-800">You can continue using DaraLearn, but please verify your email when convenient.</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="w-fit rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800">Verify email</button>
        </div>
      </div>
      {open && <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-5" onClick={() => setOpen(false)}>
        <section role="dialog" aria-modal="true" aria-labelledby="verify-email-title" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Account security</p>
              <h2 id="verify-email-title" className="mt-1 text-xl font-bold text-slate-950">Verify your email</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-2xl leading-none text-slate-400" aria-label="Close verification dialog">×</button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">Enter the code sent to <strong className="text-slate-700">{email}</strong>.</p>
          <form onSubmit={verify} className="mt-5">
            <label className="text-sm font-semibold text-slate-700">Verification code<input autoFocus required inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="123456" /></label>
            <button disabled={loading} className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading ? "Verifying..." : "Verify email"}</button>
          </form>
          <button type="button" onClick={resendCode} disabled={resending} className="mt-4 w-full text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-wait disabled:opacity-60">{resending ? "Sending code..." : "Resend code"}</button>
        </section>
      </div>}
    </>
  );
}
