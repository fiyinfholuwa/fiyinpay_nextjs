import Image from "next/image";
import Link from "next/link";

export default function Brand() {
  return <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-950"><Image src="/icons/logo.svg" width={30} height={30} alt="" />DaraLearn</Link>;
}
