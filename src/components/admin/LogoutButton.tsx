"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { SignOutIcon as SignOut } from "@phosphor-icons/react/dist/ssr";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(firebaseAuth());
    router.push("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-[13px] font-medium text-rose-100 transition-colors hover:bg-white/10 hover:text-white"
    >
      <SignOut size={16} />
      Log out
    </button>
  );
}
