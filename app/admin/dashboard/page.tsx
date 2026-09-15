"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Metrics = {
  users: number;
  tutors: number;
  students: number;
  pendingKyc: number;
  bookings: number;
  fundedAmount: number | string;
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    authorizedApi<Metrics>("/admin/dashboard")
      .then(setMetrics)
      .catch((caught) => setError(caught.message));
  }, []);
  return (
    <WorkspacePage
      eyebrow="Admin workspace"
      title="Platform overview"
      description="Monitor users, tutors, bookings, payments, and risk from one place."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total users" value={metrics?.users ?? "—"} primary />
        <Metric label="Tutors" value={metrics?.tutors ?? "—"} />
        <Metric label="Students" value={metrics?.students ?? "—"} />
        <Metric label="Bookings" value={metrics?.bookings ?? "—"} />
      </div>
      <div className="mt-6">
        <Section
          title="Operations health"
          description="Live indicators from the platform database."
        >
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-amber-50 px-3 py-2 font-semibold text-amber-700">
              {metrics?.pendingKyc ?? "—"} tutor reviews pending
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
              NGN {Number(metrics?.fundedAmount ?? 0).toLocaleString()} funded
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700">
              User controls active
            </span>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </Section>
      </div>
    </WorkspacePage>
  );
}

function Metric({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: number | string;
  primary?: boolean;
}) {
  return (
    <div
      className={
        primary
          ? "rounded-2xl bg-blue-600 p-5 text-white"
          : "rounded-2xl border border-slate-200 bg-white p-5"
      }
    >
      <span
        className={primary ? "text-sm text-blue-100" : "text-sm text-slate-500"}
      >
        {label}
      </span>
      <strong className="mt-3 block text-3xl">{value}</strong>
    </div>
  );
}
