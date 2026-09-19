"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import Toast, { ToastData } from "@/components/ui/Toast";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Subject = { id: string; name: string };
type TutorProfile = { bio?: string | null; monthlyRate: number | string; websiteUrl?: string | null; skills: { subjectId: string }[] };
type BankOption = { name: string; code: string };
type BankAccount = { bankName: string; bankCode: string; accountName: string; accountNumber: string };

export default function TutorProfilePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [bio, setBio] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccount>({ bankName: "", bankCode: "", accountName: "", accountNumber: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    Promise.all([
      authorizedApi<Subject[]>("/subjects"),
      authorizedApi<TutorProfile>("/tutors/me/profile"),
      authorizedApi<BankAccount | null>("/wallet/bank-account"),
      authorizedApi<BankOption[]>("/wallet/banks"),
    ])
      .then(([availableSubjects, profile, savedBankAccount, availableBanks]) => {
        setSubjects(availableSubjects);
        setBio(profile.bio ?? "");
        setMonthlyRate(String(profile.monthlyRate ?? ""));
        setSubjectIds(profile.skills.map((skill) => skill.subjectId));
        setWebsiteUrl(profile.websiteUrl ?? "");
        setBankAccount(savedBankAccount ?? { bankName: "", bankCode: "", accountName: "", accountNumber: "" });
        setBanks(availableBanks);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load your profile"))
      .finally(() => setLoading(false));
  }, []);

  async function resolveAccount() {
    setAccountError("");
    if (!bankAccount.bankCode || bankAccount.accountNumber.length < 6) return;
    setResolvingAccount(true);
    try {
      const resolved = await authorizedApi<{ accountName: string }>("/wallet/bank-account/resolve", {
        method: "POST",
        body: JSON.stringify({ bankCode: bankAccount.bankCode, accountNumber: bankAccount.accountNumber }),
      });
      setBankAccount((current) => ({ ...current, accountName: resolved.accountName }));
    } catch (caught) {
      setBankAccount((current) => ({ ...current, accountName: "" }));
      setAccountError(caught instanceof Error ? caught.message : "Unable to verify this account");
    } finally {
      setResolvingAccount(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setAccountError("");
    try {
      const savedBankAccount = await authorizedApi<BankAccount>("/wallet/bank-account", { method: "PATCH", body: JSON.stringify(bankAccount) });
      const savedProfile = await authorizedApi<TutorProfile>("/tutors/me/profile", { method: "PATCH", body: JSON.stringify({ bio, monthlyRate: Number(monthlyRate), subjectIds, websiteUrl: websiteUrl || undefined }) });
      setBio(savedProfile.bio ?? "");
      setMonthlyRate(String(savedProfile.monthlyRate ?? ""));
      setSubjectIds(savedProfile.skills.map((skill) => skill.subjectId));
      setBankAccount(savedBankAccount);
      setToast({ type: "success", title: "Bank verified and profile saved", message: `Paystack verified this account as ${savedBankAccount.accountName}.` });
    } catch (error) {
      setToast({ type: "error", title: "Unable to save profile", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <WorkspacePage
        eyebrow="Tutor workspace"
        title="My profile"
        description="Tell students what you teach and how you can help them."
      >
      {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
      {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500" role="status">Loading your profile...</div> : <form onSubmit={save} className="space-y-6">
        <Section title="Profile information">
          <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            About you
            <textarea
              required
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-3"
              placeholder="Describe your teaching approach"
            />
          </label>
          <label className="text-sm font-semibold">
            Monthly price
            <input
              required
              type="number"
              min="0"
              value={monthlyRate}
              onChange={(event) => setMonthlyRate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
              placeholder="50000"
            />
          </label>
          <div className="text-sm font-semibold">
            Subjects
            <div className="mt-2 flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  type="button"
                  key={subject.id}
                  onClick={() =>
                    setSubjectIds((current) =>
                      current.includes(subject.id)
                        ? current.filter((id) => id !== subject.id)
                        : [...current, subject.id],
                    )
                  }
                  className={`rounded-full px-3 py-2 text-xs ${subjectIds.includes(subject.id) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
          </div>
        </Section>
        <Section
          title="Bio link or website"
          description="Share a personal website, portfolio, or professional bio link with students."
        >
          <input
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
            placeholder="https://yourwebsite.com"
          />
          <p className="mt-2 text-xs text-slate-500">Save this link together with your profile information.</p>
        </Section>
        <Section title="Bank details for payouts" description="Paystack will verify the account before anything is saved.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Bank<select required value={bankAccount.bankCode} onChange={(event) => { const bank = banks.find((item) => item.code === event.target.value); setAccountError(""); setBankAccount({ ...bankAccount, bankCode: event.target.value, bankName: bank?.name ?? "", accountName: "" }); }} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="">Choose your bank</option>{banks.map((bank) => <option key={bank.code} value={bank.code}>{bank.name}</option>)}</select></label>
            <label className="text-sm font-semibold">Account name<input required value={bankAccount.accountName} readOnly className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3" placeholder={resolvingAccount ? "Verifying account..." : "Verify your account number"} />{resolvingAccount && <span className="mt-1 block text-xs text-slate-500" role="status">Loading account name...</span>}{accountError && <span className="mt-1 block text-xs text-red-600" role="alert">{accountError}</span>}</label>
            <label className="text-sm font-semibold sm:col-span-2">Account number<input required inputMode="numeric" value={bankAccount.accountNumber} onBlur={resolveAccount} onChange={(event) => { setAccountError(""); setBankAccount({ ...bankAccount, accountNumber: event.target.value, accountName: "" }); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="0123456789" /></label>
          </div>
        </Section>
        <button disabled={saving || resolvingAccount} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
          {saving ? "Saving profile..." : resolvingAccount ? "Verifying account..." : "Verify bank & save profile"}
        </button>
      </form>
      }
      </WorkspacePage>
    </>
  );
}
