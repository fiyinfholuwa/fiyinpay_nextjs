"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authorizedApi } from "@/lib/api";

type Subject = { id: string; name: string; description?: string | null };

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    authorizedApi<Subject[]>("/subjects")
      .then(setSubjects)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load subjects"));
  }, []);

  async function save() {
    if (!selected.length) {
      setError("Choose at least one subject to continue.");
      return;
    }
    try {
      await authorizedApi("/students/me/interests", { method: "PATCH", body: JSON.stringify({ interests: selected.map((subjectId) => ({ subjectId })) }) });
      router.push("/student/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save your interests");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Personalise your learning</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">What would you like to learn?</h1>
      <p className="mt-3 max-w-xl leading-7 text-slate-500">Choose a few interests and we’ll use them to recommend tutors who match your goals.</p>
      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => {
          const isSelected = selected.includes(subject.id);
          return <button key={subject.id} type="button" onClick={() => setSelected((current) => isSelected ? current.filter((id) => id !== subject.id) : [...current, subject.id])} className={`rounded-2xl border p-5 text-left transition ${isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-300"}`}><span className="flex items-center justify-between font-bold text-slate-950">{subject.name}<span className={`grid size-6 place-items-center rounded-full text-xs ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{isSelected ? "✓" : "+"}</span></span><span className="mt-2 block text-sm leading-6 text-slate-500">{subject.description ?? "Find a tutor and build confidence in this subject."}</span></button>;
        })}
      </div>
      <button type="button" onClick={save} className="mt-8 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white hover:bg-blue-700">See my tutor recommendations →</button>
    </main>
  );
}
