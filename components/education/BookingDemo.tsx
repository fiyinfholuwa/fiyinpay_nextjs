"use client";

import { useEffect, useState } from "react";

export default function BookingDemo() {
  const [booked, setBooked] = useState(false);
  useEffect(() => { setBooked(window.localStorage.getItem("horizon-demo-booking") === "requested"); }, []);
  const request = () => { window.localStorage.setItem("horizon-demo-booking", "requested"); setBooked(true); };
  return <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Your next lesson</p><h3 className="mt-2 text-lg font-bold text-slate-900">{booked ? "Booking request sent" : "No lesson booked yet"}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{booked ? "Your tutor will review the request from their dashboard." : "Choose a tutor below to request your first lesson."}</p>{!booked && <button onClick={request} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white">Demo booking request</button>}</div>;
}
