import { notFound } from "next/navigation";
import Dashboard from "./dashboard";
import Analytics from "./analytics";
import LayananPage from "./layanan";
import TesPage from "./test";

export default async function AdminRouter({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
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
      // case "psychologists":
      // case "payments":
      //   return <Payments />;
      default:
        notFound();
    }
  };

  return <>{renderPage()}</>;
}
