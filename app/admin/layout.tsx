import AppShell from "@/components/education/AppShell";
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="admin">{children}</AppShell>;
}
