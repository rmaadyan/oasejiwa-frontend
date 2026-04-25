import Dashboard from "@/app/admin/dashboard";
import Analytics from "@/components/features/admin/analytics/page";
import { notFound } from "next/navigation";

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