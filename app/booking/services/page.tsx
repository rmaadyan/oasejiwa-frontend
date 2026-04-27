import { ServiceSelectionContent } from "@/components/features/booking";
import { getAllLayananPublic } from "@/lib/api/layanan";

export default async function ServiceSelectionPage() {
  const rawServices = await getAllLayananPublic();
  const services = rawServices.map((s: any) => ({
    id: s.id,
    title: s.nama,
    description: s.deskripsi ?? "",
    duration: s.durasiMenit,
    price: s.harga,
    image: s.coverUrl || "/assets/service-default.jpg", 
  }));
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <ServiceSelectionContent services={services} />
    </main>
  );
}
