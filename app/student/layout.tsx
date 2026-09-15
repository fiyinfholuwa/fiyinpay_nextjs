import AppShell from "@/components/education/AppShell";
export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="student">{children}</AppShell>;
}
