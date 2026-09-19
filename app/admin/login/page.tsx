import { Suspense } from "react";
import AuthForm from "@/components/education/AuthForm";

export default function AdminLoginPage() {
  return <Suspense fallback={null}><AuthForm mode="admin" /></Suspense>;
}
