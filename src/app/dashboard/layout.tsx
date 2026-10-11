import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// The middleware only checks that a session cookie exists; this validates it.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return children;
}
