import { Suspense } from "react";
import AuthForm from "@/components/education/AuthForm";
export default function StudentRegisterPage() {
  return <Suspense fallback={null}><AuthForm mode="student" /></Suspense>;
}
