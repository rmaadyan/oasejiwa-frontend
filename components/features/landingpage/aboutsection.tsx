import { motion } from "framer-motion";
import Image from "next/image";
import { aboutImages } from "../../../lib/imageLoader";

export default function AboutSection() {
  const reasons = [
    {
      title: "Psikolog Bersertifikat",
      description:
        "Didampingi psikolog profesional dan bersertifikat untuk membantu Anda memahami kondisi dan menentukan langkah yang tepat.",
    },
    {
      title: "Pendekatan Personal",
      description:
        "Setiap sesi disesuaikan dengan kebutuhan Anda, dengan pendekatan yang hangat, suportif, dan terarah.",
    },
    {
      title: "Kerahasiaan Terjamin",
      description:
        "Privasi Anda adalah prioritas. Informasi dan proses pendampingan dijaga sesuai etika profesi.",
    },
  ];

  return (
    <motion.section
      id="about"
      className="bg-[#F5FBFF] py-16 sm:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
    >
      {/* Container utama dibuat max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top: Kenapa memilih kami */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start mb-16 sm:mb-24">
          <div className="lg:col-span-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-primary-text">
              Kenapa
              <br className="hidden sm:inline" />
              {" "}Memilih Kami
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.title} className="space-y-2">
                  <h3 className="text-lg font-bold text-primary-text">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: gambar asimetris + tentang kami */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left: Asymmetric Images (RESPONSIVE FLEX & ASPECT RATIO) */}
          <div className="lg:col-span-6 flex gap-4 items-center">
            
            {/* Image 1 - Kiri tinggi */}
            <div className="w-5/12">
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={aboutImages[0]}
                  alt="Ruang konseling Oase Jiwa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 250px"
                />
              </div>
            </div>

            {/* Kolom kanan - Image 2 & 3 */}
            <div className="w-7/12 flex flex-col gap-4">
              {/* Image 2 */}
              <div className="relative aspect-[16/10] w-[85%] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={aboutImages[1]}
                  alt="Fasilitas Oase Jiwa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 220px"
                />
              </div>

              {/* Image 3 */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={aboutImages[2]}
                  alt="Tim psikolog Oase Jiwa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 320px"
                />
              </div>
            </div>

          </div>

          {/* Right: Tentang Kami */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-text leading-tight">
              Tentang Kami
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                <strong className="text-primary-text">Oase Jiwa</strong> adalah
                lembaga layanan psikologi profesional yang berkomitmen membantu
                individu, pasangan, dan keluarga mencapai kesejahteraan mental
                optimal melalui pendampingan psikologis yang berkualitas dan
                terpercaya.
              </p>
              <p>
                Dengan tim psikolog bersertifikat dan berpengalaman, kami
                menyediakan berbagai layanan mulai dari konsultasi psikologi,
                konseling individu dan pasangan, tes psikologi (IQ, kepribadian,
                bakat minat), terapi CBT, hingga psikoedukasi yang dapat
                dilakukan secara <strong>online maupun offline</strong> sesuai
                kebutuhan Anda.
              </p>
              <p>
                Kami percaya bahwa setiap individu memiliki potensi untuk tumbuh
                dan berkembang. Melalui pendekatan yang personal dan
                profesional, kami membantu Anda{" "}
                <em className="text-primary-dark font-medium">
                  mengenali diri sendiri dan menemukan solusi terbaik
                </em>{" "}
                untuk kesehatan mental yang optimal.
              </p>
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}