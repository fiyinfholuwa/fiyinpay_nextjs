"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Student = { id: string; firstName: string; lastName: string; email: string };
type Booking = { student: Student };
type Assignment = { id: string; title: string; instructions: string; type: string; points: number; dueAt?: string | null; durationMinutes?: number | null; student: Student; submission?: { answer?: string | null; fileName?: string | null; score?: number | null; feedback?: string | null } | null };

export default function TutorAssignmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState({ studentId: "", title: "", instructions: "", type: "ESSAY", options: "", points: "100", dueAt: "", durationMinutes: "15" });
  const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    Promise.all([
      authorizedApi<Booking[]>("/tutors/me/bookings"),
      authorizedApi<Assignment[]>("/tutors/me/assignments"),
    ]).then(([bookings, currentAssignments]) => {
      setStudents(Array.from(new Map(bookings.map((booking) => [booking.student.id, booking.student])).values()));
      setAssignments(currentAssignments);
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load assignments"));
  }
  useEffect(() => { load(); }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await authorizedApi("/tutors/me/assignments", { method: "POST", body: JSON.stringify({ studentId: form.studentId, title: form.title, instructions: form.instructions, type: form.type, options: form.options ? form.options.split("\n").map((item) => item.trim()).filter(Boolean) : undefined, points: Number(form.points), dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined, durationMinutes: form.type === "OBJECTIVE" ? Number(form.durationMinutes) : undefined }) });
      setMessage("Assignment created.");
      setForm({ studentId: "", title: "", instructions: "", type: "ESSAY", options: "", points: "100", dueAt: "", durationMinutes: "15" });
      load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create assignment"); }
    finally { setSaving(false); }
  }

  async function grade(assignment: Assignment) {
    const grade = grades[assignment.id];
    if (!grade || grade.score === "") return;
    try {
      await authorizedApi(`/assignments/${assignment.id}/grade`, { method: "PATCH", body: JSON.stringify({ score: Number(grade.score), feedback: grade.feedback }) });
      setMessage("Assignment graded.");
      load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to grade assignment"); }
  }

  return <WorkspacePage eyebrow="Tutor workspace" title="Assignments" description="Set work for your students and grade their submissions.">
    {message && <p className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</p>}
    <Section title="Create assignment" description="Choose objective for multiple choice, essay for written work, or upload for submitted files.">
      <form onSubmit={create} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Student<select required value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="">Select a student</option>{students.map((student) => <option value={student.id} key={student.id}>{student.firstName} {student.lastName} · {student.email}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Algebra practice" /></label>
        <label className="text-sm font-semibold text-slate-700 md:col-span-2">Instructions<textarea required value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Explain what the student should complete" /></label>
        <label className="text-sm font-semibold text-slate-700">Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="OBJECTIVE">Objective</option><option value="ESSAY">Essay</option><option value="UPLOAD">Upload</option></select></label>
        <label className="text-sm font-semibold text-slate-700">Points<input required min="1" type="number" value={form.points} onChange={(event) => setForm({ ...form, points: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
        {form.type === "OBJECTIVE" && <label className="text-sm font-semibold text-slate-700 md:col-span-2">Choices, one per line<textarea required value={form.options} onChange={(event) => setForm({ ...form, options: event.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Option A\nOption B\nOption C" /></label>}
        {form.type === "OBJECTIVE" && <label className="text-sm font-semibold text-slate-700">Timer in minutes<input required min="1" type="number" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>}
        <label className="text-sm font-semibold text-slate-700">Due date<input type="datetime-local" value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
        <button disabled={saving} className="self-end rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Creating..." : "Create assignment"}</button>
      </form>
    </Section>
    <div className="mt-6 space-y-5">{assignments.map((assignment) => <Section key={assignment.id} title={assignment.title} description={`${assignment.student.firstName} ${assignment.student.lastName} · ${assignment.type} · ${assignment.points} points${assignment.durationMinutes ? ` · ${assignment.durationMinutes} minute timer` : ""}`}>
      <p className="text-sm leading-6 text-slate-600">{assignment.instructions}</p>
      {assignment.submission ? <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-800">Submission {assignment.submission.fileName ? `· ${assignment.submission.fileName}` : ""}</p>{assignment.submission.answer && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{assignment.submission.answer}</p>}<div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr_auto]"><input min="0" max={assignment.points} type="number" placeholder={`Score / ${assignment.points}`} value={grades[assignment.id]?.score ?? assignment.submission.score ?? ""} onChange={(event) => setGrades({ ...grades, [assignment.id]: { score: event.target.value, feedback: grades[assignment.id]?.feedback ?? assignment.submission?.feedback ?? "" } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><input placeholder="Feedback" value={grades[assignment.id]?.feedback ?? assignment.submission.feedback ?? ""} onChange={(event) => setGrades({ ...grades, [assignment.id]: { score: grades[assignment.id]?.score ?? String(assignment.submission?.score ?? ""), feedback: event.target.value } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><button type="button" onClick={() => grade(assignment)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">Save grade</button></div></div> : <p className="mt-4 text-sm text-slate-500">Awaiting student submission.</p>}
    </Section>)}</div>
  </WorkspacePage>;
}
