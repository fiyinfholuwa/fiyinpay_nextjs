import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";

export default function AdminSettings() {
  return <WorkspacePage eyebrow="Admin workspace" title="Platform settings" description="Review configuration that affects platform operations."><Section title="Payment configuration" description="Paystack keys, SMTP delivery, and database settings are managed securely in the backend environment."><div className="space-y-3 text-sm text-slate-600"><div className="rounded-xl bg-slate-50 p-4"><strong className="block text-slate-950">Paystack</strong><span>Wallet funding uses server-side transaction verification. Add PAYSTACK_SECRET_KEY to the backend environment to enable checkout.</span></div><div className="rounded-xl bg-slate-50 p-4"><strong className="block text-slate-950">Email delivery</strong><span>SMTP settings control OTP and password reset delivery. Without SMTP, development OTPs are logged by the API.</span></div></div></Section></WorkspacePage>;
}
