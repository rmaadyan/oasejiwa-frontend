import Image from "next/image";
import { motion } from "framer-motion";
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
      className="bg-[#F5FBFF] py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4">
        {/* Top: Kenapa memilih kami */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start mb-20">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-semibold leading-tight text-primary-text md:text-5xl">
              Kenapa
              <br />
              Memilih Kami
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.title}>
                  <h3 className="mb-3 text-lg font-semibold text-primary-text">
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
<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
  {/* Left: Asymmetric Images - ASIMETRIS & LEBAR */}
  <div className="flex gap-4 h-96">
    {/* Image 1 - Kiri tinggi (LEBIH SEMPIT - 40%) */}
    <div className="flex items-center w-[40%]">
      <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src={aboutImages[0]}
          alt="Ruang konseling Oase Jiwa"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 40vw, 220px"
        />
      </div>
    </div>

    {/* Kolom kanan - Image 2 & 3 (LEBIH LEBAR - 60%) */}
    <div className="flex flex-col justify-center gap-4 w-[60%]">
      {/* Image 2 - Kotak kecil (tidak penuh lebar) */}
      <div className="relative w-[75%] h-56 rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src={aboutImages[1]}
          alt="Fasilitas Oase Jiwa"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 35vw, 200px"
        />
      </div>

      {/* Image 3 - LANDSCAPE LEBAR BANGET (penuh lebar kolom) */}
      <div className="relative w-full h-44 rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src={aboutImages[2]}
          alt="Tim psikolog Oase Jiwa"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 300px"
        />
      </div>
    </div>
  </div>

  {/* Right: Tentang Kami */}
  <div className="space-y-6">
    <h2 className="text-4xl font-semibold text-primary-text leading-tight md:text-5xl">
      Tentang Kami
    </h2>
    <div className="space-y-4 text-gray-600 leading-relaxed">
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
        <em className="text-primary-dark">
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
