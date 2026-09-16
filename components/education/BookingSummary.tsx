"use client";

import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";

type Booking = { id: string; startsAt: string; status: string; tutor: { firstName: string; lastName: string }; subject: { name: string } };

export default function BookingSummary() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    authorizedApi<Booking[]>("/students/me/bookings")
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Scheduled classes</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{bookings.length ? "Your upcoming classes" : "No class scheduled yet"}</h3>
      {bookings.length ? <div className="mt-4 space-y-3">{bookings.slice(0, 3).map((booking) => <div className="rounded-xl border border-blue-100 bg-white/80 p-3" key={booking.id}><strong className="block text-sm text-slate-900">{booking.subject.name} with {booking.tutor.firstName} {booking.tutor.lastName}</strong><span className="mt-1 block text-xs text-slate-500">{new Date(booking.startsAt).toLocaleString()} · {booking.status}</span></div>)}</div> : <div className="mt-3 rounded-xl border border-dashed border-blue-200 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-600">Subscribe to a tutor to see your scheduled classes here.</div>}
    </div>
  );
}
