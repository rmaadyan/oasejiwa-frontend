interface BookingHeroProps {
  title: React.ReactNode;
  subtitle: string;
}

export default function BookingHero({ title, subtitle }: BookingHeroProps) {
  return (
    <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-[#f5f7fb]">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
          {title}
        </h1>
        <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
