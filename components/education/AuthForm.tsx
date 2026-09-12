"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

type AuthFormProps = { mode: "login" | "student" | "tutor" };

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";
  const role = mode === "tutor" ? "tutor" : "student";
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); router.push(`/${role}/dashboard`); };

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10"><Link href="/" className="text-sm font-semibold text-blue-600">← Back home</Link><div className="mt-8"><h1 className="text-3xl font-bold tracking-tight text-slate-950">{isLogin ? "Welcome back" : `Create your ${role} account`}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{isLogin ? "Choose your workspace and continue learning." : "Join Horizon and make learning easier."}</p></div><form onSubmit={submit} className="mt-8 space-y-4">{!isLogin && <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold text-slate-700">First name<input required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Ada" /></label><label className="text-sm font-semibold text-slate-700">Last name<input required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Lovelace" /></label></div>}<label className="block text-sm font-semibold text-slate-700">Email<input required type="email" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" /></label><label className="block text-sm font-semibold text-slate-700">Password<input required type="password" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="••••••••" /></label><button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">{isLogin ? "Log in" : "Create account"}</button></form><p className="mt-7 text-center text-sm text-slate-500">{isLogin ? "New to Horizon? " : "Already have an account? "}<Link className="font-semibold text-blue-600" href={isLogin ? "/register/student" : "/login"}>{isLogin ? "Create an account" : "Log in"}</Link></p>{isLogin && <div className="mt-4 flex justify-center gap-4 text-xs"><Link className="text-blue-600 hover:underline" href="/register/student">Register as student</Link><Link className="text-blue-600 hover:underline" href="/register/tutor">Register as tutor</Link></div>}</section></main>;
}
