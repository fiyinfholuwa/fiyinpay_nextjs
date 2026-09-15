import AppShell from "@/components/education/AppShell";
export default function TutorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="tutor">{children}</AppShell>;
}
