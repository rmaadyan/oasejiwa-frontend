import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";

// Import custom icons untuk TikTok dan Threads
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.186 3.998c-2.259 0-4.024.548-5.254 1.633-1.182 1.042-1.798 2.516-1.832 4.388l.003.065h2.585c.026-1.177.408-2.07 1.137-2.656.713-.573 1.782-.863 3.179-.863 1.335 0 2.361.27 3.052.804.687.53 1.055 1.313 1.094 2.328.033.849-.281 1.543-.934 2.063-.417.332-1.007.605-1.755.814l-.295.08c-1.002.27-1.843.547-2.502.826-1.025.433-1.836 1.012-2.413 1.721-.601.739-.905 1.67-.905 2.768 0 1.641.61 2.938 1.815 3.858 1.183.904 2.773 1.363 4.73 1.363 1.964 0 3.577-.456 4.797-1.356 1.216-.897 1.88-2.178 1.977-3.815l-.001-.064h-2.615c-.052.924-.423 1.623-1.103 2.079-.672.451-1.632.681-2.857.681-1.218 0-2.184-.252-2.873-.749-.673-.486-1.011-1.185-1.011-2.081 0-.75.268-1.354.797-1.797.522-.437 1.308-.797 2.337-1.072l.413-.109c.995-.263 1.82-.538 2.456-.817 1.011-.444 1.809-1.029 2.372-1.738.585-.738.88-1.67.88-2.773 0-1.783-.665-3.172-1.98-4.131-1.297-.947-3.084-1.427-5.318-1.427z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Perumahan+d'soeta+residence+Blk.+D+No.1+Babatan+Tegalgondo+Karang+Ploso+Malang";
  const whatsappUrl = "https://wa.me/6281313888830";

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
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-[#25D366] transition-colors"
              >
                <Phone className="h-4 w-4" />
                0813-1388-8830
              </Link>
              <Link
                href="mailto:psikologioasejiwa@gmail.com"
                className="hover:underline hover:text-slate-900 transition-colors block"
              >
                psikologioasejiwa@gmail.com
              </Link>
            </div>
          </div>

          {/* Ikuti Kami */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">Ikuti Kami</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <Link
                href="https://www.facebook.com/oasejiwa.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-[#1877F2] transition-colors"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Link>
              <Link
                href="https://x.com/psikologmalang?s=21&t=n1mKVJdlxpzgUN2irbkNUg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-slate-900 transition-colors"
              >
                <XIcon className="h-4 w-4" />
                X (Twitter)
              </Link>
              <Link
                href="https://instagram.com/oasejiwa.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-[#E4405F] transition-colors"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </Link>
              <Link
                href="https://www.tiktok.com/@oasejiwa.id?_r=1&_t=ZS-93dDmNIhnn7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-slate-900 transition-colors"
              >
                <TikTokIcon className="h-4 w-4" />
                TikTok
              </Link>
              <Link
                href="https://www.threads.com/@oasejiwa.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline hover:text-slate-900 transition-colors"
              >
                <ThreadsIcon className="h-4 w-4" />
                Threads
              </Link>
            </div>
          </div>

          {/* Alamat */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900">Alamat</h4>
            <Link
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-700 hover:text-[#4285F4] hover:underline transition-colors group"
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 group-hover:text-[#4285F4]" />
              <span>
                Perumahan d&apos;soeta residence, Blk. D No.1, Babatan, Tegalgondo,
                Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65152
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-slate-600">
          Copyright © 2026 Oase Jiwa
        </div>
      </div>
    </footer>
  );
}
