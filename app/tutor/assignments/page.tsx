"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import Toast, { ToastData } from "@/components/ui/Toast";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Student = { id: string; firstName: string; lastName: string; email: string };
type Booking = { status: string; student: Student };
type QuizQuestion = { question: string; choices: string[]; correctAnswer: string };
type Assignment = { id: string; title: string; instructions: string; type: string; points: number; dueAt?: string | null; durationMinutes?: number | null; student: Student; options?: { questions?: QuizQuestion[] } | null; submission?: { answer?: string | null; fileName?: string | null; score?: number | null; feedback?: string | null } | null };
type AssignmentType = "OBJECTIVE" | "ESSAY" | "UPLOAD";

const typeOptions: { value: AssignmentType; label: string; description: string }[] = [
  { value: "OBJECTIVE", label: "Quick quiz", description: "Students choose from answers" },
  { value: "ESSAY", label: "Written work", description: "Students write their response" },
  { value: "UPLOAD", label: "File submission", description: "Students upload their work" },
];
const emptyQuestion = (): QuizQuestion => ({ question: "", choices: ["", ""], correctAnswer: "" });
const typeLabel = (type: string) => typeOptions.find((option) => option.value === type)?.label ?? type;

export default function TutorAssignmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", title: "", instructions: "", type: "ESSAY" as AssignmentType, questionCount: "1", questions: [emptyQuestion()], points: "100", dueAt: "", durationMinutes: "15" });
  const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>({});
  const [toast, setToast] = useState<ToastData | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    Promise.all([authorizedApi<Booking[]>("/tutors/me/bookings"), authorizedApi<Assignment[]>("/tutors/me/assignments")])
      .then(([bookings, currentAssignments]) => {
        setStudents(Array.from(new Map(bookings.filter((booking) => booking.status === "CONFIRMED").map((booking) => [booking.student.id, booking.student])).values()));
        setAssignments(currentAssignments);
      })
      .catch((error) => setToast({ type: "error", title: "Unable to load assignments", message: error instanceof Error ? error.message : "Please try again." }));
  }
  useEffect(() => { load(); }, []);

  function changeQuestionCount(value: string) {
    const count = Math.max(1, Math.min(50, Number(value) || 1));
    setForm((current) => ({ ...current, questionCount: String(count), questions: Array.from({ length: count }, (_, index) => current.questions[index] ?? emptyQuestion()) }));
  }
  function updateQuestion(index: number, values: Partial<QuizQuestion>) {
    setForm((current) => ({ ...current, questions: current.questions.map((question, questionIndex) => questionIndex === index ? { ...question, ...values } : question) }));
  }
  function updateChoice(questionIndex: number, choiceIndex: number, value: string) {
    setForm((current) => ({ ...current, questions: current.questions.map((question, index) => index === questionIndex ? { ...question, choices: question.choices.map((choice, index) => index === choiceIndex ? value : choice), correctAnswer: question.correctAnswer === question.choices[choiceIndex] ? value : question.correctAnswer } : question) }));
  }
  function addChoice(questionIndex: number) {
    setForm((current) => ({ ...current, questions: current.questions.map((question, index) => index === questionIndex ? { ...question, choices: [...question.choices, ""] } : question) }));
  }
  function resetForm() {
    setForm({ studentId: "", title: "", instructions: "", type: "ESSAY", questionCount: "1", questions: [emptyQuestion()], points: "100", dueAt: "", durationMinutes: "15" });
  }

  async function create(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const questions = form.questions.map((question) => ({ question: question.question.trim(), choices: question.choices.map((choice) => choice.trim()).filter(Boolean), correctAnswer: question.correctAnswer }));
      await authorizedApi("/tutors/me/assignments", { method: "POST", body: JSON.stringify({ studentId: form.studentId, title: form.title, instructions: form.instructions, type: form.type, options: form.type === "OBJECTIVE" ? { questions } : undefined, points: Number(form.points), dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined, durationMinutes: form.type === "OBJECTIVE" ? Number(form.durationMinutes) : undefined }) });
      resetForm();
      setFormOpen(false);
      setToast({ type: "success", title: "Assignment sent", message: "Your student can now see the new assignment." });
      load();
    } catch (error) {
      setToast({ type: "error", title: "Unable to create assignment", message: error instanceof Error ? error.message : "Please try again." });
    } finally { setSaving(false); }
  }
  async function grade(assignment: Assignment) {
    const gradeValue = grades[assignment.id];
    if (!gradeValue || gradeValue.score === "") return;
    try {
      await authorizedApi(`/assignments/${assignment.id}/grade`, { method: "PATCH", body: JSON.stringify({ score: Number(gradeValue.score), feedback: gradeValue.feedback }) });
      setToast({ type: "success", title: "Grade saved", message: "The student can now see your feedback." });
      load();
    } catch (error) { setToast({ type: "error", title: "Unable to save grade", message: error instanceof Error ? error.message : "Please try again." }); }
  }

  return <>
    <Toast toast={toast} onClose={() => setToast(null)} />
    <WorkspacePage eyebrow="Tutor workspace" title="Assignments" description="Give your students clear work to complete and review their answers here.">
      <Section title="Your assignments" description="Create a quiz, written task, or file submission for a confirmed student.">
        {!students.length && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">You need a confirmed student before you can create an assignment.</p>}
        <button type="button" disabled={!students.length} onClick={() => setFormOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">+ Create assignment</button>
      </Section>
      <div className="mt-6 space-y-5">{assignments.map((assignment) => <Section key={assignment.id} title={assignment.title} description={`${assignment.student.firstName} ${assignment.student.lastName} · ${typeLabel(assignment.type)} · ${assignment.points} marks${assignment.durationMinutes ? ` · ${assignment.durationMinutes} minutes` : ""}`}><p className="text-sm leading-6 text-slate-600">{assignment.instructions}</p>{assignment.type === "OBJECTIVE" && assignment.options?.questions?.length && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-sm font-bold text-blue-900">Answer key</p><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-blue-800">{assignment.options.questions.map((question, index) => <li key={index}>{question.correctAnswer || "No answer selected"}</li>)}</ol></div>}{assignment.submission ? <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-800">Student response{assignment.submission.fileName ? ` · ${assignment.submission.fileName}` : ""}</p>{assignment.submission.answer && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{assignment.submission.answer}</p>}<div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr_auto]"><input aria-label="Score" min="0" max={assignment.points} type="number" placeholder={`Score / ${assignment.points}`} value={grades[assignment.id]?.score ?? assignment.submission.score ?? ""} onChange={(event) => setGrades({ ...grades, [assignment.id]: { score: event.target.value, feedback: grades[assignment.id]?.feedback ?? assignment.submission?.feedback ?? "" } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><input aria-label="Feedback" placeholder="Write helpful feedback" value={grades[assignment.id]?.feedback ?? assignment.submission.feedback ?? ""} onChange={(event) => setGrades({ ...grades, [assignment.id]: { score: grades[assignment.id]?.score ?? String(assignment.submission?.score ?? ""), feedback: event.target.value } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><button type="button" onClick={() => grade(assignment)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">Save grade</button></div></div> : <p className="mt-4 text-sm text-slate-500">Waiting for the student to submit their work.</p>}</Section>)}</div>
    </WorkspacePage>
    {formOpen && <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/40 px-4 py-8" onClick={() => setFormOpen(false)}><section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">New assignment</p><h2 className="mt-1 text-xl font-bold text-slate-950">Set up student work</h2></div><button type="button" onClick={() => setFormOpen(false)} className="text-2xl leading-none text-slate-400" aria-label="Close">×</button></div><form onSubmit={create} className="mt-5 space-y-5"><label className="block text-sm font-semibold text-slate-700">Who is this for?<select required value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="">Choose a student</option>{students.map((student) => <option value={student.id} key={student.id}>{student.firstName} {student.lastName}</option>)}</select></label><label className="block text-sm font-semibold text-slate-700">Assignment title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="For example: Mathematics practice" /></label><label className="block text-sm font-semibold text-slate-700">Instructions<textarea required value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Explain what the student should do" /></label><fieldset><legend className="text-sm font-semibold text-slate-700">Assignment type</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{typeOptions.map((option) => <button type="button" key={option.value} onClick={() => setForm({ ...form, type: option.value })} className={`rounded-xl border p-4 text-left ${form.type === option.value ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-300"}`}><strong className="block text-sm text-slate-900">{option.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span></button>)}</div></fieldset>{form.type === "OBJECTIVE" && <div className="space-y-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Number of questions<input required min="1" max="50" type="number" value={form.questionCount} onChange={(event) => changeQuestionCount(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3" /></label><label className="block text-sm font-semibold text-slate-700">Time limit in minutes<input required min="1" type="number" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3" /></label></div>{form.questions.map((question, questionIndex) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={questionIndex}><p className="text-sm font-bold text-slate-800">Question {questionIndex + 1}</p><input required value={question.question} onChange={(event) => updateQuestion(questionIndex, { question: event.target.value })} className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Write the question" /><div className="mt-3 space-y-2">{question.choices.map((choice, choiceIndex) => <div className="flex items-center gap-2" key={choiceIndex}><input required value={choice} onChange={(event) => updateChoice(questionIndex, choiceIndex, event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder={`Answer choice ${choiceIndex + 1}`} /><input type="radio" required name={`correct-${questionIndex}`} checked={question.correctAnswer === choice && choice !== ""} onChange={() => updateQuestion(questionIndex, { correctAnswer: choice })} aria-label={`Mark choice ${choiceIndex + 1} as correct`} /></div>)}</div><p className="mt-2 text-xs text-slate-500">Select the radio button beside the correct answer.</p><button type="button" onClick={() => addChoice(questionIndex)} className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800">+ Add another choice</button></div>)}</div>}<div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Total marks<input required min="1" type="number" value={form.points} onChange={(event) => setForm({ ...form, points: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label><label className="block text-sm font-semibold text-slate-700">Finish by <span className="font-normal text-slate-500">(optional)</span><input type="datetime-local" value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label></div><button disabled={saving} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Sending..." : "Send assignment"}</button></form></section></div>}
  </>;
}
