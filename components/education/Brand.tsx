import Image from "next/image";
import Link from "next/link";

export default function Brand({ className = "text-blue-700" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-2xl font-bold tracking-tight ${className}`}
    >
      <Image
        src="/icons/logo.svg"
        width={30}
        height={30}
        alt="DaraLearn logo"
      />
      DaraLearn
    </Link>
  );
}
