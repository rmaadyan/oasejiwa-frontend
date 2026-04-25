import ServiceCard from "@/components/booking/ServiceCard";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
}

interface ServiceSelectionSectionProps {
  services: Service[];
  selectedService: string | null;
  onSelectService: (id: string) => void;
}

export default function ServiceSelectionSection({
  services,
  selectedService,
  onSelectService,
}: ServiceSelectionSectionProps) {
  return (
    <>
      {/* Section Title */}
      <div className="mb-6 animate-fadeIn stagger-3">
        <h2 className="text-2xl font-bold text-[#234463] mb-2">
          Pilih Layanan
        </h2>
        <p className="text-[#4B4B4B]">
          Pilih layanan yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${(index + 4) * 0.1}s` }}
          >
            <ServiceCard
              id={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              image={service.image}
              duration={service.duration}
              isSelected={selectedService === service.id}
              onSelect={onSelectService}
            />
          </div>
        ))}
      </div>
    </>
  );
}
