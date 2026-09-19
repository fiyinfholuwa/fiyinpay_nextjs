"use client";

import { FormEvent, useEffect, useState } from "react";
import Section from "@/components/education/Section";
import Toast, { ToastData } from "@/components/ui/Toast";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Booking = { subject: { id: string; name: string }; status: string };
type Schedule = { id: string; startsAt: string; endsAt: string; meetingLink: string; subject: { name: string } };

export default function SchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [form, setForm] = useState({ subjectId: "", startsAt: "", endsAt: "", meetingLink: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  function load() {
    Promise.all([authorizedApi<Booking[]>("/tutors/me/bookings"), authorizedApi<Schedule[]>("/tutors/me/schedules")])
      .then(([currentBookings, currentSchedules]) => { setBookings(currentBookings); setSchedules(currentSchedules); })
      .catch((error) => setToast({ type: "error", title: "Unable to load schedule", message: error instanceof Error ? error.message : "Please try again." }));
  }
  useEffect(() => { load(); }, []);

  const subjects = Array.from(new Map(bookings.filter((booking) => booking.status === "CONFIRMED").map((booking) => [booking.subject.id, booking.subject])).values());

  async function create(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await authorizedApi("/tutors/me/schedules", { method: "POST", body: JSON.stringify({ subjectId: form.subjectId, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString(), meetingLink: form.meetingLink }) });
      setToast({ type: "success", title: "Class scheduled", message: "All confirmed students for this subject can now see the meeting link." });
      setForm({ subjectId: "", startsAt: "", endsAt: "", meetingLink: "" });
      load();
    } catch (error) {
      setToast({ type: "error", title: "Unable to schedule class", message: error instanceof Error ? error.message : "Please try again." });
    } finally { setSaving(false); }
  }

  return <>
    <Toast toast={toast} onClose={() => setToast(null)} />
    <WorkspacePage eyebrow="Tutor workspace" title="Schedule" description="Create subject classes for all students with confirmed bookings.">
      <Section title="Create a class schedule" description="Students with confirmed bookings for the selected subject will receive this meeting link.">
        <form onSubmit={create} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Subject<select required value={form.subjectId} onChange={(event) => setForm({ ...form, subjectId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="">Select a confirmed subject</option>{subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Meeting link<input required type="url" value={form.meetingLink} onChange={(event) => setForm({ ...form, meetingLink: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="https://meet.google.com/..." /></label>
          <label className="text-sm font-semibold text-slate-700">Starts at<input required type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          <label className="text-sm font-semibold text-slate-700">Ends at<input required type="datetime-local" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          <button disabled={saving || !subjects.length} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2">{saving ? "Scheduling..." : "Schedule class"}</button>
          {!subjects.length && <p className="text-sm text-amber-700 md:col-span-2">A confirmed student booking is required before you can schedule a subject class.</p>}
        </form>
      </Section>
      <Section title="Scheduled classes" description="These schedules are shared with matching confirmed students.">
        <div className="space-y-3">{schedules.map((schedule) => <div className="flex flex-col gap-3 rounded-xl bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between" key={schedule.id}><div><strong className="block text-sm">{schedule.subject.name} · {new Date(schedule.startsAt).toLocaleString()}</strong><span className="text-xs text-slate-500">Ends {new Date(schedule.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></div><a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-blue-700">Open meeting link</a></div>)}{!schedules.length && <p className="text-sm text-slate-500">No classes scheduled yet.</p>}</div>
      </Section>
    </WorkspacePage>
  </>;
}
