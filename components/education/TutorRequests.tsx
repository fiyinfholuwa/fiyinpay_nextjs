"use client";

import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";

type Booking = { id: string; startsAt: string; status: string; student: { firstName: string; lastName: string }; subject: { name: string } };

export default function TutorRequests() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const load = () => authorizedApi<Booking[]>("/tutors/me/bookings").then((bookings) => setRequests(bookings.filter((booking) => booking.status === "PENDING"))).catch(() => setRequests([]));
  useEffect(() => { load(); }, []);
  async function update(id: string, status: "CONFIRMED" | "CANCELLED") {
    await authorizedApi(`/tutors/me/bookings/${id}/${status}`, { method: "PATCH" });
    load();
  }
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Booking requests</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{requests.length} pending</span></div>{requests.length ? <div className="mt-5 space-y-3">{requests.map((request) => <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4" key={request.id}><div><strong className="block text-sm">{request.student.firstName} {request.student.lastName}</strong><span className="text-xs text-slate-500">{request.subject.name} · {new Date(request.startsAt).toLocaleString()}</span></div><div className="flex gap-2"><button type="button" onClick={() => update(request.id, "CONFIRMED")} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Accept</button><button type="button" onClick={() => update(request.id, "CANCELLED")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600">Decline</button></div></div>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">New student requests will appear here.</p>}</div>;
}
