import Image from "next/image";

export default function VisionMissionSection() {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative w-full max-w-[400px] aspect-square rounded-[30px] overflow-hidden mx-auto lg:mx-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
            <Image
              src="/assets/about-us/about-us2.jpg"
              alt="Vision Mission"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="space-y-10">
            {/* Vision */}
            <div>
              <div className="bg-gradient-to-r from-[#2B5379] to-[#3a6a94] rounded-[30px] px-6 py-3 mb-5 inline-flex items-center gap-3 min-w-[100px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
                <h3 className="text-white text-[20px] md:text-[24px] font-semibold text-center">
                  VISI
                </h3>
              </div>
              <p className="text-[14px] md:text-[16px] font-medium text-[#4B4B4B] leading-relaxed">
                Menjadi lembaga layanan psikologi yang profesional, mudah diakses, dan berdampak
                melalui pemerataan akses layanan demi terciptanya kejiwaan masyarakat yang
                bertumbuh dan sehat.
              </p>
            </div>

            {/* Mission */}
            <div>
              <div className="bg-gradient-to-r from-[#2B5379] to-[#3a6a94] rounded-[30px] px-6 py-3 mb-5 inline-flex items-center gap-3 min-w-[100px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
                <h3 className="text-white text-[20px] md:text-[24px] font-semibold text-center">
                  MISI
                </h3>
              </div>
              <ul className="list-disc pl-5 text-[14px] md:text-[16px] font-medium text-[#4B4B4B] leading-relaxed space-y-2">
                <li>
                  Menciptakan pelayanan yang berlandaskan profesionalisme, sesuai dengan kode etik profesi dan aturan perundang-undangan yang berlaku
                </li>
                <li>
                  Memperluas akses layanan psikologi yang terjangkau dan terbuka bagi seluruh masyarakat
                </li>
                <li>
                  Membangun jejaring kepada seluruh pihak untuk memperkuat infrastruktur pelayanan kesehatan jiwa di masyarakat
                </li>
                <li>
                  Mendorong budaya inovatif dan kreatif demi keberlanjutan layanan psikologi yang berbasis evidence based yang sesuai dengan kebutuhan masyarakat dan relevan dengan perkembangan zaman
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
