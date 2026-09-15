import Link from "next/link";
export default function LandingCta() {
  return (
    <section className="mx-5 mb-10 overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center text-white shadow-xl shadow-blue-200 sm:mx-8 sm:px-10 lg:mx-auto lg:max-w-7xl">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to learn differently?
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-blue-100">
        Start with one lesson. Build a habit that lasts.
      </p>
      <Link
        href="/register/student"
        className="mt-7 inline-flex rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 hover:bg-blue-50"
      >
        Create your free account →
      </Link>
    </section>
  );
}
