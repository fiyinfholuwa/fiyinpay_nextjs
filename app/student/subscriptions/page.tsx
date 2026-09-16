"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/education/EmptyState";
import Section from "@/components/education/Section";
import WorkspacePage from "@/components/education/WorkspacePage";
import { authorizedApi } from "@/lib/api";

type Booking = { id: string; startsAt: string; amount: number | string; status: string; tutor: { firstName: string; lastName: string }; subject: { name: string }; subscription?: { status: string } | null };

export default function SubscriptionsPage() {
  return (
    <SubscriptionsContent />
  );
}

function SubscriptionsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    authorizedApi<Booking[]>("/students/me/bookings")
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);
  return (
    <WorkspacePage
      eyebrow="Student workspace"
      title="My subscriptions"
      description="Keep track of the tutors and lessons you follow."
    >
      <Section
        title="Active tutor subscriptions"
        description="Your current learning relationships."
      >
        <div className="space-y-3">
          {bookings.map((booking) => <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4" key={booking.id}><div><strong className="block text-sm">{booking.tutor.firstName} {booking.tutor.lastName}</strong><span className="text-xs text-slate-500">{booking.subject.name} · {new Date(booking.startsAt).toLocaleString()}</span></div><span className="text-right text-sm font-bold text-blue-600">NGN {Number(booking.amount).toLocaleString()}<span className="block text-xs font-normal text-slate-500">{booking.subscription?.status ?? booking.status}</span>{booking.status === "PENDING" && <button type="button" className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-xs text-white" onClick={async () => { try { await authorizedApi(`/bookings/${booking.id}/pay`, { method: "POST" }); setMessage("Booking confirmed and subscription activated."); setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, status: "CONFIRMED", subscription: { status: "ACTIVE" } } : item)); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to confirm booking"); } }}>Pay from wallet</button>}</span></div>)}
          {!bookings.length && (
            <EmptyState
              title="No active subscriptions yet"
              description="Choose a tutor and book your first lesson to start building your learning plan."
              action={{ label: "Find a tutor", onClick: () => window.location.assign("/student/tutors") }}
            />
          )}
          {message && <p className="mt-3 text-sm text-slate-500">{message}</p>}
        </div>
      </Section>
    </WorkspacePage>
  );
}
