
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-[#202A24]/15">
        <Link href="/" className="text-3xl font-bold tracking-tight">
          gather<span className="text-[#D65A3A]">.</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold hover:text-[#D65A3A] transition-colors"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-[#D65A3A] text-[#202A24] px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D65A3A] mb-6">
            Event Management
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1]">
            Plan better.
            <br />
            <span className="text-[#D65A3A]">Gather better.</span>
          </h1>

          <p className="text-base md:text-lg opacity-65 mt-7 max-w-xl mx-auto leading-relaxed">
            Create, manage and organize your events in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="bg-[#D65A3A] text-[#202A24] px-8 py-4 rounded-md font-bold hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors"
            >
              Create an account →
            </Link>

            <Link
              href="/login"
              className="border border-[#202A24]/30 px-8 py-4 rounded-md font-semibold hover:border-[#D65A3A] hover:text-[#D65A3A] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-5 border-t border-[#202A24]/15 flex justify-between items-center text-xs opacity-60">
        <span className="font-bold text-base text-[#202A24]">
          gather<span className="text-[#D65A3A]">.</span>
        </span>
        <span>Event Management System</span>
      </footer>
    </main>
  );
}
