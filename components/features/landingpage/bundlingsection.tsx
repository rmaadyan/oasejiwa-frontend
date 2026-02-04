"use client";

import { motion } from "framer-motion";

const bundlingPackages = [
  {
    id: 1,
    name: "Bundling Konseling",
    sessions: "3x sesi",
    price: "Rp 500.000",
    discount: "Hemat 16,7%",
    description: "Paket konseling individu untuk pendampingan berkelanjutan dan hasil yang lebih optimal.",
  },
  {
    id: 2,
    name: "Bundling Psikoterapi",
    sessions: "5x sesi",
    price: "Rp 1.200.000",
    discount: "Hemat 20%",
    description: "Paket sesi psikoterapi intensif untuk proses pendampingan dan perubahan yang mendalam.",
  },
  {
    id: 3,
    name: "Bundling Konseling Pasangan",
    sessions: "3x sesi",
    price: "Rp 1.150.000",
    discount: "Hemat 23,3%",
    description: "Paket konseling pasangan untuk membangun hubungan yang lebih harmonis bersama psikolog.",
  },
];

export default function BundlingSection() {
  return (
    <motion.section
      className="bg-white py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold text-primary-text md:text-5xl">
            Paket Bundling
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Hemat lebih banyak dengan paket layanan bundling kami
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundlingPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-primary-light transition-colors"
            >
              {/* Badge Diskon */}
              <div className="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                {pkg.discount}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-xl font-semibold text-primary-text">
                {pkg.name}
              </h3>

              {/* Sessions */}
              <p className="mt-2 text-sm text-slate-600">{pkg.sessions}</p>

              {/* Price */}
              <p className="mt-4 text-3xl font-bold text-primary-dark">
                {pkg.price}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {pkg.description}
              </p>

              {/* Button */}
              <a
                href="https://wa.me/6281313888830"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex h-11 items-center justify-center rounded-full bg-[#0B7A3B] text-sm font-medium text-white hover:bg-[#0a6a34] transition-colors"
              >
                Booking Paket
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
