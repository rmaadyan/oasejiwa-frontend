import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#F5FBFF] py-16">
      <div className="mx-auto max-w-5xl px-2 sm:px-3 lg:px-4">
        <div className="text-center">
          <h3 className="text-3xl font-semibold tracking-wide text-primary-text md:text-4xl">
            Siap Memulai Perjalanan Menuju Diri yang Lebih Baik?
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#2B5379]">
            Hubungi kami hari ini untuk mendapatkan konsultasi pertama dengan psikolog profesional kami. Kami siap mendengarkan dan membantu Anda mencapai kesejahteraan mental yang optimal.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="https://wa.me/6281313888830"
              target="_blank"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B7A3B] px-12 text-sm font-medium text-white hover:bg-[#0a6a34] transition-colors"
            >
              Hubungi Kami Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
