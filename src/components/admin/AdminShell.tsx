"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/ui";

/** Gate for every admin page: waits for Firebase to restore the session, otherwise sends the editor to sign in. */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth(), (next) => {
        setUser(next);
        if (!next) router.replace("/admin/login");
      }),
    [router],
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <span className="size-8 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
      </div>
    );
  }

  const email = user.email ?? "";
  return (
    <ToastProvider>
      <AdminSidebar admin={{ name: user.displayName || email.split("@")[0] || "Admin", email }} />
      <div className="min-h-screen lg:ml-60">{children}</div>
    </ToastProvider>
  );
}
