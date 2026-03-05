import { notFound } from "next/navigation";
import Dashboard from "@/app/admin/dashboard";
import Analytics from "@/app/admin/analytics";

export default async function AdminCatchAllRouter({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const pageName = slug?.[0] || "dashboard";

  // Master router logic
  const renderPage = () => {
    switch (pageName) {
      case "dashboard":
      case "": // untuk /admin root
        return <Dashboard />;
      case "analytics":
        return <Analytics />;
      // case "psychologists":
      //   return <Psychologists />;
      // case "users":
      //   return <Users />;
      // case "services":
      //   return <Services />;
      // case "payments":
      //   return <Payments />;
      default:
        notFound();
    }
  };

  return <>{renderPage()}</>;
}
