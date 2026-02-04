import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#DFF1FF]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          {/* Logo */}
          <div className="md:col-span-3">
            <div className="relative h-50 w-50">
              <Image
                src="/logo.png"
                alt="Oase Jiwa"
                fill
                className="object-contain"
                sizes="176px"
              />
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">
              Jam Operasional
            </h4>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>Senin – Sabtu : 09.00 – 21.00</p>
              <p>Minggu : Tutup</p>
            </div>

            <h4 className="mt-6 text-sm font-semibold text-slate-900">
              Kontak
            </h4>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>
                <Link
                  href="tel:081313888830"
                  className="hover:underline"
                >
                  0813-1388-8830
                </Link>
              </p>
              <p>
                <Link
                  href="mailto:psikologioasejiwa@gmail.com"
                  className="hover:underline"
                >
                  psikologioasejiwa@gmail.com
                </Link>
              </p>
            </div>
          </div>

          {/* Ikuti Kami */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">Ikuti Kami</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link
                href="#"
                className="flex items-center gap-2 hover:underline"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 hover:underline"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Link>
              <Link
                href="https://instagram.com/oasejiwa.id"
                target="_blank"
                className="flex items-center gap-2 hover:underline"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </Link>
            </div>
          </div>

          {/* Alamat */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">Alamat</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Perumahan d&apos;soeta residence, Blk. D No.1, Babatan, Tegalgondo,
              Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65152
            </p>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-slate-600">
          Copyright © 2026 Oase Jiwa
        </div>
      </div>
    </footer>
  );
}
