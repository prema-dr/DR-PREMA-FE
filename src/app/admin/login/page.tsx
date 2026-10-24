import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-rose-950 via-[#6e1530] to-[#b0254f] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 top-1/3 size-96 rounded-full bg-rose-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-rose-500/20 blur-3xl" />
        <p className="relative font-name text-4xl italic">Dr Prema</p>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight">Care for the site that cares for patients.</h2>
          <p className="mt-4 text-rose-200/80">Manage services, articles, patient stories, galleries, publications and videos, all in one place.</p>
        </div>
        <p className="relative text-xs uppercase tracking-[0.2em] text-rose-300/70">Admin Console</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="admin-rise w-full max-w-sm">
          <p className="font-name text-3xl italic text-rose-700 lg:hidden">Dr Prema</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-600 lg:mt-0">Restricted access</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-rose-950">Welcome back</h1>
          <p className="mt-2 text-sm text-rose-900/60">Sign in with your admin account to continue.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
