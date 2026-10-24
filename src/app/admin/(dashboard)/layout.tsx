import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/ui";
import { ADMIN_COOKIE, API_URL } from "@/lib/admin-server";

type Me = { id: number; email: string; name: string };

async function getAdmin(): Promise<Me> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  } catch {
    // Backend unreachable: keep the shell up and let each page show its own error state.
    return { id: 0, email: "", name: "Admin" };
  }
  if (res.status === 401) redirect("/api/admin-logout");
  return res.ok ? res.json() : { id: 0, email: "", name: "Admin" };
}

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return (
    <ToastProvider>
      <AdminSidebar admin={admin} />
      <div className="min-h-screen lg:ml-60">{children}</div>
    </ToastProvider>
  );
}
