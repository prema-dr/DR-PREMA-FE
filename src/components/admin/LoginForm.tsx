"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon as Eye, EyeSlashIcon as EyeSlash, WarningCircleIcon as WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Button, inputClass } from "@/components/admin/ui";

function signInError(code: string) {
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait a few minutes and try again.";
  if (code === "auth/network-request-failed") return "Cannot reach the server. Try again shortly.";
  if (code === "auth/user-disabled") return "This account has been disabled.";
  return "Invalid email or password";
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // Already signed in (session restored by Firebase): skip the form.
  useEffect(() => onAuthStateChanged(firebaseAuth(), (user) => user && router.replace("/admin")), [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(firebaseAuth(), String(form.get("email")), String(form.get("password")));
      router.push("/admin");
      return;
    } catch (e) {
      setError(signInError((e as { code?: string }).code ?? ""));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-rose-950">
          Email
        </label>
        <input id="email" name="email" type="email" required autoFocus autoComplete="username" placeholder="you@clinic.com" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-rose-950">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            minLength={8}
            autoComplete="current-password"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-900/45 hover:text-rose-700"
          >
            {show ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          <WarningCircle size={18} weight="fill" className="mt-px shrink-0" />
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full !py-3">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
