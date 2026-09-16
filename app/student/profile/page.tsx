"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import Toast, { ToastData } from "@/components/ui/Toast";
import { authorizedApi } from "@/lib/api";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

type Subject = { id: string; name: string; description?: string | null };
type InterestResponse = { interests: { subjectId: string }[] };

export default function StudentProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    Promise.all([
      authorizedApi<User>("/auth/me"),
      authorizedApi<Subject[]>("/subjects"),
      authorizedApi<InterestResponse>("/students/me/interests"),
    ])
      .then(([currentUser, availableSubjects, savedInterests]) => {
        setUser(currentUser);
        setSubjects(availableSubjects);
        setSelected(savedInterests.interests.map((interest) => interest.subjectId));
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load your profile"))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !selected.length) {
      setError("Choose at least one interest to continue.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const [updatedUser] = await Promise.all([
        authorizedApi<User>("/auth/me/profile", {
          method: "PATCH",
          body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName }),
        }),
        authorizedApi("/students/me/interests", {
          method: "PATCH",
          body: JSON.stringify({ interests: selected.map((subjectId) => ({ subjectId })) }),
        }),
      ]);
      setUser(updatedUser);
      setToast({ type: "success", title: "Profile updated", message: "Your name and interests have been saved." });
    } catch (caught) {
      setToast({ type: "error", title: "Unable to save profile", message: caught instanceof Error ? caught.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="w-full space-y-8 px-5 py-10 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Student workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">My profile</h1>
          <p className="mt-2 text-slate-500">Keep your details and learning interests up to date.</p>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading your profile...</div>
        ) : (
          <form onSubmit={saveProfile} className="grid gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
            <Section title="Personal details" description="These details appear on your DaraLearn account.">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  First name
                  <input required minLength={2} value={user?.firstName ?? ""} onChange={(event) => setUser((current) => current ? { ...current, firstName: event.target.value } : current)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Last name
                  <input required minLength={2} value={user?.lastName ?? ""} onChange={(event) => setUser((current) => current ? { ...current, lastName: event.target.value } : current)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Email address
                  <input disabled value={user?.email ?? ""} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" />
                </label>
              </div>
            </Section>

            <Section title="Learning interests" description="Choose the subjects you want to see in your tutor recommendations.">
              <div className="grid gap-3 sm:grid-cols-2">
                {subjects.map((subject) => {
                  const isSelected = selected.includes(subject.id);
                  return (
                    <button key={subject.id} type="button" onClick={() => setSelected((current) => isSelected ? current.filter((id) => id !== subject.id) : [...current, subject.id])} className={`rounded-xl border p-4 text-left transition ${isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-300"}`}>
                      <span className="flex items-center justify-between font-bold text-slate-950">{subject.name}<span className={`grid size-6 place-items-center rounded-full text-xs ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{isSelected ? "✓" : "+"}</span></span>
                      <span className="mt-2 block text-sm leading-5 text-slate-500">{subject.description ?? "Find a tutor and build confidence in this subject."}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving profile..." : "Save changes"}</button>
              </div>
            </Section>
          </form>
        )}
      </main>
    </>
  );
}
