import Image from "next/image";

export default function CeoMessageSection() {
  return (
    <section className="bg-gradient-to-br from-[#E8F6FF] to-[#d4edff] py-20 px-6 lg:px-16 relative overflow-hidden">
      {/* Decorative Circle */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2B5379]/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#234463]/5 rounded-full blur-3xl animate-pulse-soft animation-delay-200" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-[250px] h-[350px] md:w-[302px] md:h-[415px] rounded-[700px] overflow-hidden shadow-2xl ring-4 ring-white/50 hover:ring-[#2B5379]/30 transition-all duration-300 group">
              <Image
                src="/assets/about-us/about-us.jpg"
                alt="CEO"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#234463] mb-5">
              Ucapan CEO
            </h2>

            {/* Quote with big quotation mark */}
            <div className="relative">
              {/* Big Quote Mark - Above */}
              <svg
                className="w-16 h-16 text-[#2B5379]/20 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[14px] md:text-[16px] font-medium italic text-[#4B4B4B] leading-relaxed border-l-4 border-[#2B5379]/30 pl-4">
                Di Oase Jiwa, kami percaya bahwa setiap orang berhak
                mendapatkan dukungan kesehatan mental yang berkualitas. Kami
                berkomitmen untuk menciptakan ruang aman di mana Anda dapat
                berbicara, didengar, dan mendapatkan bantuan profesional tanpa
                rasa takut akan stigma. Kesehatan mental sama pentingnya dengan
                kesehatan fisik, dan kami ada di sini untuk menemani perjalanan
                Anda menuju kesejahteraan yang lebih baik.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="w-12 h-[2px] bg-[#2B5379]"></div>
              <p className="text-[14px] md:text-[16px] font-semibold text-[#234463]">
                Dr. Sarah Wijaya, Founder & CEO Oase Jiwa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
