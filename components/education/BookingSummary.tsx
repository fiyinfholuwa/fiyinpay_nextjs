"use client";

import { useEffect, useState } from "react";
import { authorizedApi } from "@/lib/api";

type Booking = { id: string; startsAt: string; status: string; tutor: { firstName: string; lastName: string }; subject: { name: string } };

export default function BookingSummary() {
  const [booking, setBooking] = useState<Booking | null>(null);
  useEffect(() => {
    authorizedApi<Booking[]>("/students/me/bookings")
      .then((bookings) => setBooking(bookings[0] ?? null))
      .catch(() => setBooking(null));
  }, []);
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Your next lesson</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{booking ? `${booking.subject.name} with ${booking.tutor.firstName}` : "No lesson booked yet"}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{booking ? `${new Date(booking.startsAt).toLocaleString()} · ${booking.status}` : "Choose a tutor below to request your first lesson."}</p>
    </div>
  );
}
