import SideBar from "@/components/SideBar";
import MobileNav from "@/components/MobileNav";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: "Adrian", lastName: "Hajdin", email: "adrian@horizon.app" };
  return (
    <main className="flex min-h-screen bg-slate-50">
      <SideBar user={loggedIn} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 md:hidden">
          <MobileNav />
          <span className="font-serif text-xl font-bold text-[#00214f]">Horizon</span>
        </header>
        {children}
      </div>
    </main>
  );
}
