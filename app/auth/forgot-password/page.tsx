import { Suspense } from "react";
import AuthForm from "@/components/education/AuthForm";
export default function ForgotPasswordPage() {
  return <Suspense fallback={null}><AuthForm mode="forgot" /></Suspense>;
}
