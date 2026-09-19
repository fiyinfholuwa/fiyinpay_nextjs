"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Assignment = {
  id: string;
  title: string;
  instructions: string;
  type: "OBJECTIVE" | "ESSAY" | "UPLOAD";
  options?: { choices?: string[]; questions?: { question: string; choices: string[] }[] } | null;
  points: number;
  durationMinutes?: number | null;
  dueAt?: string | null;
  tutor: { firstName: string; lastName: string };
  submission?: { answer?: string | null; fileName?: string | null; score?: number | null; feedback?: string | null } | null;
};
type Draft = { answer?: string; fileName?: string; fileData?: string };

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [startedAssignments, setStartedAssignments] = useState<Record<string, boolean>>({});
  const [openAssignments, setOpenAssignments] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(0);

  function load() {
    return authorizedApi<Assignment[]>("/students/me/assignments")
      .then((currentAssignments) => {
        setAssignments(currentAssignments);
        const started: Record<string, boolean> = {};
        currentAssignments.forEach((assignment) => {
          started[assignment.id] = Boolean(window.localStorage.getItem(`daralearn-assignment-start-${assignment.id}`));
        });
        setStartedAssignments(started);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load assignments"))
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!assignments.length) return;
    const updateTimers = () => {
      const next: Record<string, number> = {};
      assignments.forEach((assignment) => {
        if (assignment.type !== "OBJECTIVE" || !assignment.durationMinutes || assignment.submission) return;
        const storageKey = `daralearn-assignment-start-${assignment.id}`;
        const storedStart = window.localStorage.getItem(storageKey);
        if (!storedStart) return;
        const startedAt = Number(storedStart);
        next[assignment.id] = Math.max(0, startedAt + assignment.durationMinutes * 60_000 - Date.now());
      });
      setTimeLeft(next);
      setNow(Date.now());
    };
    updateTimers();
    const interval = window.setInterval(updateTimers, 1000);
    return () => window.clearInterval(interval);
  }, [assignments]);

  function updateDraft(id: string, values: Draft) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...values } }));
  }

  function uploadFile(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateDraft(id, { fileName: file.name, fileData: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function formatTimer(milliseconds: number) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
  }

  function startQuiz(assignmentId: string) {
    window.localStorage.setItem(`daralearn-assignment-start-${assignmentId}`, String(new Date().getTime()));
    setStartedAssignments((current) => ({ ...current, [assignmentId]: true }));
  }

  async function submit(event: FormEvent, assignment: Assignment) {
    event.preventDefault();
    const draft = drafts[assignment.id] ?? {};
    setSubmitting(assignment.id);
    setMessage("");
    try {
      await authorizedApi(`/assignments/${assignment.id}/submissions`, { method: "POST", body: JSON.stringify(draft) });
      setMessage("Assignment submitted successfully.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit assignment");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <WorkspacePage eyebrow="Student workspace" title="Assignments" description="Complete work from your tutors and review your grades and feedback.">
      {message && <p className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</p>}
      {loading && <Section title="Assignments"><p className="text-sm text-slate-500">Loading assignments...</p></Section>}
      {!loading && !assignments.length && <Section title="Assignments"><div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center"><h2 className="text-lg font-bold text-slate-900">No assignments yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Your tutor will post objective questions, essays, or upload tasks here.</p></div></Section>}
      <div className="space-y-5">{assignments.map((assignment) => {
        const draft = drafts[assignment.id] ?? {};
        let selectedAnswers: Record<string, string> = {};
        try {
          selectedAnswers = draft.answer?.startsWith("{") ? JSON.parse(draft.answer) as Record<string, string> : {};
        } catch {
          selectedAnswers = {};
        }
        const graded = assignment.submission?.score !== null && assignment.submission?.score !== undefined;
        const deadlinePassed = Boolean(assignment.dueAt && new Date(assignment.dueAt).getTime() <= now);
        const timerPassed = assignment.type === "OBJECTIVE" && Boolean(assignment.durationMinutes) && (timeLeft[assignment.id] ?? 0) <= 0 && !assignment.submission;
        const expired = deadlinePassed || timerPassed;
        const quizStarted = startedAssignments[assignment.id];
        const completed = Boolean(assignment.submission);
        const open = openAssignments[assignment.id];
        return <Section key={assignment.id} title={assignment.title} description={`From ${assignment.tutor.firstName} ${assignment.tutor.lastName} · ${assignment.type} · ${assignment.points} points${assignment.dueAt ? ` · Due ${new Date(assignment.dueAt).toLocaleString()}` : ""}`}>
          {completed ? <div className="rounded-xl bg-emerald-50 px-4 py-4"><p className="text-sm font-bold text-emerald-800">Assignment completed and closed</p>{graded && <p className="mt-1 text-sm text-emerald-700">Grade: {assignment.submission?.score}/{assignment.points}{assignment.submission?.feedback ? ` · ${assignment.submission.feedback}` : ""}</p>}</div> : !open ? <div><p className="leading-7 text-slate-600">{assignment.instructions}</p><button type="button" onClick={() => setOpenAssignments((current) => ({ ...current, [assignment.id]: true }))} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Open assignment</button></div> : <>
          <p className="leading-7 text-slate-600">{assignment.instructions}</p>
          {assignment.type === "OBJECTIVE" && !assignment.submission && !quizStarted && !deadlinePassed && <button type="button" onClick={() => startQuiz(assignment.id)} className="mt-5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">Start quiz</button>}
          {assignment.type === "OBJECTIVE" && assignment.durationMinutes && quizStarted && !assignment.submission && <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${timerPassed ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{timerPassed ? "Time expired" : `Time remaining: ${formatTimer(timeLeft[assignment.id] ?? assignment.durationMinutes * 60_000)}`}</p>}
          {assignment.type === "OBJECTIVE" && quizStarted && assignment.options?.questions?.length ? <div className="mt-5 space-y-5">{assignment.options.questions.map((question, questionIndex) => <fieldset className="rounded-xl border border-slate-200 p-4" key={questionIndex}><legend className="px-1 text-sm font-bold text-slate-800">Question {questionIndex + 1}: {question.question}</legend><div className="mt-2 space-y-2">{question.choices.map((choice) => <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700" key={choice}><input type="radio" name={`assignment-${assignment.id}-question-${questionIndex}`} checked={selectedAnswers[questionIndex] === choice} onChange={() => updateDraft(assignment.id, { answer: JSON.stringify({ ...selectedAnswers, [questionIndex]: choice }) })} />{choice}</label>)}</div></fieldset>)}</div> : assignment.type === "OBJECTIVE" && quizStarted && <div className="mt-5 space-y-2">{(assignment.options?.choices ?? []).map((choice) => <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700" key={choice}><input type="radio" name={`assignment-${assignment.id}`} checked={draft.answer === choice} onChange={() => updateDraft(assignment.id, { answer: choice })} />{choice}</label>)}</div>}
          {assignment.type === "ESSAY" && <textarea value={draft.answer ?? assignment.submission?.answer ?? ""} onChange={(event) => updateDraft(assignment.id, { answer: event.target.value })} className="mt-5 min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Write your response" />}
          {assignment.type === "UPLOAD" && <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5"><input type="file" onChange={(event) => uploadFile(assignment.id, event)} className="block w-full text-sm text-slate-500" />{draft.fileName && <p className="mt-3 text-sm font-semibold text-slate-700">Selected: {draft.fileName}</p>}{assignment.submission?.fileName && !draft.fileName && <p className="mt-3 text-sm text-slate-500">Submitted file: {assignment.submission.fileName}</p>}</div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><div>{expired ? <p className="text-sm font-semibold text-red-700">Submission closed</p> : assignment.type === "OBJECTIVE" && !quizStarted ? <p className="text-sm text-slate-500">Read the instructions, then start when you are ready.</p> : <p className="text-sm text-slate-500">Not submitted</p>}</div>{!expired && (assignment.type !== "OBJECTIVE" || quizStarted) && <button type="button" disabled={submitting === assignment.id} onClick={(event) => submit(event, assignment)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{submitting === assignment.id ? "Submitting..." : "Submit assignment"}</button>}</div>
          </>}
        </Section>;
      })}</div>
    </WorkspacePage>
  );
}
