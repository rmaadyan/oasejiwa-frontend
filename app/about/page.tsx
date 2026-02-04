import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StatCard from "@/components/ui/StatCard";
import TeamMemberCard from "@/components/ui/TeamMemberCard";

// Icons for Stats
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-10 h-10"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const teamMembers = [
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Dr. Sarah Wijaya",
    role: "Founder",
    experience:
      "Psikolog klinis dengan pengalaman lebih dari 15 tahun dalam bidang kesehatan mental dan konseling.",
  },
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Dr. Budi Santoso",
    role: "Co-Founder",
    experience:
      "Ahli psikologi perkembangan dengan spesialisasi dalam terapi keluarga dan anak-anak.",
  },
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Putri Rahayu, M.Psi",
    role: "Lead Psychologist",
    experience:
      "Spesialis dalam terapi kognitif-behavioral dengan fokus pada kecemasan dan depresi.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        {/* Hero Title */}
        <div className="pt-36 pb-8 px-6 lg:px-16 text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold animate-fade-in-up">
            <span className="text-[#000000]">About </span>
            <span className="text-[#234463]">Us</span>
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <Image
            src="/assets/about-us.jpg"
            alt="About Us Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Stats Floating Card */}
        <div className="relative z-10 -mt-16 md:-mt-20 px-4 md:px-6 lg:px-16">
          <div className="max-w-[829px] mx-auto bg-white rounded-[23px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] p-6 md:p-8 animate-fade-in-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex justify-center">
                <StatCard
                  icon={<UserIcon />}
                  value="1K+"
                  label="Jumlah orang terbantu"
                />
              </div>
              <div className="flex justify-center md:border-x md:border-gray-200 md:px-8">
                <StatCard icon={<StarIcon />} value="30+" label="Jumlah rating" />
              </div>
              <div className="flex justify-center">
                <StatCard
                  icon={<UsersIcon />}
                  value="3+"
                  label="Jumlah psikolog"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
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

      {/* CEO Message Section */}
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
                <svg className="w-16 h-16 text-[#2B5379]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
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

      {/* Behind Our Team Section */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[28px] md:text-[36px] font-semibold text-[#234463] text-center mb-12">
            Behind Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                imageSrc={member.imageSrc}
                name={member.name}
                role={member.role}
                experience={member.experience}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-[#f8fcff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-semibold text-[#234463] mb-5">
                Our Location
              </h2>

              {/* Location Box - Changed div to a */}
              <a 
                href="https://www.google.com/maps/dir/-7.9429632,112.6105088/Biro+Psikologi+Oase+Jiwa,+perumahan+d'soeta+residence,+Blk.+D+No.1,+Babatan,+Tegalgondo,+Kec.+Karang+Ploso,+Kabupaten+Malang,+Jawa+Timur+65152/@-7.9302109,112.5944297,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x2e78810048aa2731:0x954fa836b2e3f0de!2m2!1d112.5964097!2d-7.9170422?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-[#A1A1A1] rounded-[10px] px-4 py-3 mb-5 inline-flex items-center gap-2 hover:border-[#2B5379] hover:bg-[#E8F6FF]/50 transition-all duration-300 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#2B5379]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className="text-[14px] md:text-[16px] text-[#4B4B4B] font-medium">Malang, Jawa Timur</p>
              </a>

              {/* Divider */}
              <div className="h-[0.5px] bg-[#4B4B4B] w-full mb-5" />

              {/* Location Details */}
              <h3 className="text-[18px] md:text-[20px] font-semibold text-[#234463] mb-3">
                Location Details
              </h3>
              <p className="text-[14px] md:text-[16px] text-[#4B4B4B] leading-relaxed mb-5">
                Perumahan D&apos;Soeta Residence, Blk. D No.1, Babatan, Tegalgondo,
                Karang Ploso, Kabupaten Malang, Jawa Timur 65152. Lokasi kami
                mudah diakses dan berada di lingkungan yang tenang dan nyaman,
                cocok untuk sesi konseling yang kondusif.
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-[#E49D1A]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-[#E49D1A] font-bold text-lg">5.0</span>
                <span className="text-[#4B4B4B] text-sm">(100 reviews)</span>
              </div>

              {/* CTA Button */}
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234463] to-[#2B5379] text-white font-semibold px-8 py-4 rounded-[30px] hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                Konseling Disini
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <Image
                src="/assets/about-us/oasejiwa.jpg"
                alt="Our Location"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
