"use client";

import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";

type Schedule = {
  id: string;
  startsAt: string;
  meetingLink: string;
  tutor: { firstName: string; lastName: string };
  subject: { name: string };
};

export default function BookingSummary() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  useEffect(() => {
    authorizedApi<Schedule[]>("/students/me/schedules")
      .then(setSchedules)
      .catch(() => setSchedules([]));
  }, []);

  const upcomingSchedules = schedules
    .filter((schedule) => new Date(schedule.startsAt).getTime() >= Date.now())
    .slice(0, 3);

  return (
    <div className="h-full rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Scheduled classes</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{upcomingSchedules.length ? "Your upcoming classes" : "No class scheduled yet"}</h3>
      {upcomingSchedules.length ? <div className="mt-4 space-y-3">{upcomingSchedules.map((schedule) => <div className="rounded-xl border border-blue-100 bg-white/80 p-3" key={schedule.id}><strong className="block text-sm text-slate-900">{schedule.subject.name} with {schedule.tutor.firstName} {schedule.tutor.lastName}</strong><span className="mt-1 block text-xs text-slate-500">{new Date(schedule.startsAt).toLocaleString()}</span><a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Join class</a></div>)}</div> : <div className="mt-3 rounded-xl border border-dashed border-blue-200 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-600">Your tutor has not scheduled a class for your confirmed subject yet.</div>}
    </div>
  );
}
