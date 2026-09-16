import { Suspense } from "react";
import AuthForm from "@/components/education/AuthForm";
export default function TutorRegisterPage() {
  return <Suspense fallback={null}><AuthForm mode="tutor" /></Suspense>;
}
