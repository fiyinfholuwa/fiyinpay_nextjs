"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api, saveAccessToken } from "@/lib/api";
import Toast, { ToastData } from "@/components/ui/Toast";

type AuthFormProps = { mode: "login" | "student" | "tutor" | "forgot" | "reset" };

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const role = mode === "tutor" ? "TUTOR" : "STUDENT";

  useEffect(() => {
    if (isLogin && searchParams.get("registered") === "1") {
      setToast({ type: "success", title: "Account created", message: "You can now log in. Remember to verify your email from your dashboard." });
    }
  }, [isLogin, searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      if (verificationRequired) {
        const result = await api<{ accessToken: string }>("/auth/verify-email", { method: "POST", body: JSON.stringify({ email, code: otp }) });
        saveAccessToken(result.accessToken);
        router.push(role === "TUTOR" ? "/tutor/profile" : "/student/onboarding");
        return;
      }
      if (isForgot) {
        const result = await api<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
        setToast({ type: "success", title: "Check your email", message: result.message });
        return;
      }
      if (isReset) {
        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) throw new Error("This reset link is missing or invalid");
        const result = await api<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
        setToast({ type: "success", title: "Password reset", message: result.message });
        return;
      }
      if (isLogin) {
        const result = await api<{ accessToken: string; requiresEmailVerification: boolean; user: { role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        if (result.user.role !== loginRole) {
          throw new Error(`This email belongs to a ${result.user.role === "TUTOR" ? "tutor" : "student"} account. Choose the correct login tab.`);
        }
        saveAccessToken(result.accessToken);
        router.push(result.user.role === "TUTOR" ? "/tutor/dashboard" : "/student/dashboard");
        return;
      }
      await api<{ accessToken: string; message: string }>("/auth/register", { method: "POST", body: JSON.stringify({ email, password, firstName, lastName, role }) });
      router.push("/login?registered=1");
    } catch (caught) {
      setToast({ type: "error", title: "", message: caught instanceof Error ? caught.message : "Unable to complete request" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10">
        <Link href="/" className="text-sm font-semibold text-blue-600">← Back home</Link>
        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{verificationRequired ? "Verify your email" : isForgot ? "Forgot password" : isReset ? "Reset password" : isLogin ? "Welcome back" : `Create your ${role.toLowerCase()} account`}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{verificationRequired ? "Enter the six-digit code we sent to your email." : isForgot ? "Enter your email and we will send a reset link." : isLogin ? `Log in as a ${loginRole === "TUTOR" ? "tutor" : "student"} to continue your learning journey.` : "Create your DaraLearn account to get started."}</p>
        </div>
        {isLogin && !verificationRequired && <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account type">
          {(["STUDENT", "TUTOR"] as const).map((roleOption) => {
            const active = loginRole === roleOption;
            return <button key={roleOption} type="button" role="tab" aria-selected={active} onClick={() => { setLoginRole(roleOption); setToast(null); }} className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {roleOption === "STUDENT" ? "Student" : "Tutor"}
            </button>;
          })}
        </div>}
        <form onSubmit={submit} className="mt-8 space-y-4">
          {!isLogin && !isForgot && !isReset && !verificationRequired && <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold text-slate-700">First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Ada" /></label>
            <label className="text-sm font-semibold text-slate-700">Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Lovelace" /></label>
          </div>}
          <label className="block text-sm font-semibold text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" /></label>
          {verificationRequired ? <label className="block text-sm font-semibold text-slate-700">Verification code<input required inputMode="numeric" pattern="[0-9]{6}" value={otp} onChange={(event) => setOtp(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="123456" /></label> : !isForgot && <label className="block text-sm font-semibold text-slate-700">Password<input required type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="••••••••" /></label>}
          {isLogin && <Link href="/auth/forgot-password" className="block text-right text-xs font-semibold text-blue-600">Forgot password?</Link>}
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading ? "Please wait…" : verificationRequired ? "Verify email" : isForgot ? "Send reset link" : isLogin ? "Log in" : "Create account"}</button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">{isLogin ? "New to DaraLearn? " : "Already have an account? "}<Link className="font-semibold text-blue-600" href={isLogin ? "/register/student" : "/login"}>{isLogin ? "Create an account" : "Log in"}</Link></p>
      </section>
    </main>
  );
}
