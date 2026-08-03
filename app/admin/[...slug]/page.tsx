import { notFound } from "next/navigation";
import Dashboard from "@/app/admin/dashboard";
import Analytics from "@/app/admin/analytics";
import Users from "@/app/admin/users";


export default async function AdminCatchAllRouter({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const pageName = slug?.[0] || "dashboard";

  switch (pageName) {
    case "dashboard":
    case "":
      return <Dashboard />;

    case "analytics":
      return <Analytics />;

    case "users":
      return <Users />;

    default:
      notFound();
  }
}