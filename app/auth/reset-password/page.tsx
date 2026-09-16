import { Suspense } from "react";
import AuthForm from "@/components/education/AuthForm";
export default function ResetPasswordPage() {
  return <Suspense fallback={null}><AuthForm mode="reset" /></Suspense>;
}
