import { notFound } from "next/navigation";
import Dashboard from "@/app/admin/dashboard";
import Analytics from "@/app/admin/analytics";
import LayananPage from "@/app/admin/layanan";
import TesPage from "@/app/admin/test";

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
      case "layanan":
        return <LayananPage />;
      case "test":
        return <TesPage />;
 
      default:
        notFound();
    }
  };

  return <>{renderPage()}</>;
}
