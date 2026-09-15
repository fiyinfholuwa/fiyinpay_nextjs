"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Booking = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  student: { firstName: string; lastName: string };
  subject: { name: string };
};

export default function SchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    authorizedApi<Booking[]>("/tutors/me/bookings")
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);
  return (
    <WorkspacePage
      eyebrow="Tutor workspace"
      title="Schedule"
      description="Plan your lessons and manage your availability."
    >
      <Section title="Upcoming lessons">
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              className={`rounded-xl p-4 ${booking.status === "CONFIRMED" ? "bg-blue-50" : "bg-slate-50"}`}
              key={booking.id}
            >
              <strong className="block text-sm">
                {new Date(booking.startsAt).toLocaleString()}
              </strong>
              <span className="text-xs text-slate-500">
                {booking.subject.name} with {booking.student.firstName}{" "}
                {booking.student.lastName} · {booking.status}
              </span>
            </div>
          ))}
          {!bookings.length && (
            <p className="text-sm text-slate-500">
              Your upcoming lessons will appear here.
            </p>
          )}
        </div>
      </Section>
    </WorkspacePage>
  );
}
