"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerifiedAt?: string | null;
  tutorProfile?: {
    id: string;
    kycStatus: string;
    monthlyRate: number | string;
  } | null;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const load = () =>
    authorizedApi<User[]>(
      `/admin/users?search=${encodeURIComponent(search)}${role ? `&role=${role}` : ""}`,
    )
      .then(setUsers)
      .catch((error) => setMessage(error.message));
  useEffect(() => {
    load();
  }, [role]);

  async function toggleStatus(user: User) {
    try {
      await authorizedApi(`/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
        }),
      });
      load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update user",
      );
    }
  }

  async function reviewTutor(user: User, status: "APPROVED" | "REJECTED") {
    if (!user.tutorProfile) return;
    try {
      await authorizedApi(
        `/admin/tutors/${user.tutorProfile.id}/kyc/${status}`,
        { method: "PATCH" },
      );
      load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to review tutor",
      );
    }
  }

  return (
    <WorkspacePage
      eyebrow="Admin workspace"
      title="Users and tutors"
      description="Search accounts, manage access, and monitor tutor verification."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && load()}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
          placeholder="Search name or email"
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        >
          <option value="">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="TUTOR">Tutors</option>
          <option value="ADMIN">Admins</option>
        </select>
        <button
          type="button"
          onClick={load}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
        >
          Search
        </button>
      </div>
      <Section title={`${users.length} users`}>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              className="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={user.id}
            >
              <div>
                <strong className="block text-sm">
                  {user.firstName} {user.lastName}
                </strong>
                <span className="text-xs text-slate-500">
                  {user.email} · {user.role} ·{" "}
                  {user.emailVerifiedAt ? "Verified" : "Unverified"}
                </span>
                {user.tutorProfile && (
                  <span className="mt-1 block text-xs text-blue-600">
                    KYC: {user.tutorProfile.kycStatus} · NGN{" "}
                    {Number(user.tutorProfile.monthlyRate).toLocaleString()}
                    /month
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`text-xs font-bold ${user.status === "ACTIVE" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {user.status}
                </span>
                {user.tutorProfile?.kycStatus === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => reviewTutor(user, "APPROVED")}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                    >
                      Approve KYC
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewTutor(user, "REJECTED")}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                {user.role !== "ADMIN" && (
                  <button
                    type="button"
                    onClick={() => toggleStatus(user)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                  >
                    {user.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {!users.length && (
            <p className="text-sm text-slate-500">
              {message || "No users found."}
            </p>
          )}
        </div>
      </Section>
    </WorkspacePage>
  );
}
