"use client";

import { useEffect, useState } from "react";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Booking = {
  id: string;
  status: string;
  student: { firstName: string; lastName: string; email: string };
  subject: { name: string };
};

export default function StudentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    authorizedApi<Booking[]>("/tutors/me/bookings")
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);
  const students = Array.from(
    new Map(
      bookings.map((booking) => [booking.student.email, booking]),
    ).values(),
  );
  return (
    <WorkspacePage
      eyebrow="Tutor workspace"
      title="My students"
      description="See the students currently learning with you."
    >
      <Section title={`${students.length} active students`}>
        <div className="space-y-3">
          {students.map((booking) => (
            <div
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
              key={booking.student.email}
            >
              <div>
                <strong className="block text-sm">
                  {booking.student.firstName} {booking.student.lastName}
                </strong>
                <span className="text-xs text-slate-500">
                  {booking.subject.name} · {booking.student.email}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {booking.status}
              </span>
            </div>
          ))}
          {!students.length && (
            <p className="text-sm text-slate-500">
              Your students will appear after a booking is confirmed.
            </p>
          )}
        </div>
      </Section>
    </WorkspacePage>
  );
}
