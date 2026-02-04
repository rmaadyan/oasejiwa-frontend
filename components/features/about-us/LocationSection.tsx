import Image from "next/image";
import Link from "next/link";

export default function LocationSection() {
  return (
    <section className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-[#f8fcff]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#234463] mb-5">
              Our Location
            </h2>

            {/* Location Box */}
            <a
              href="https://www.google.com/maps/dir/-7.9429632,112.6105088/Biro+Psikologi+Oase+Jiwa,+perumahan+d'soeta+residence,+Blk.+D+No.1,+Babatan,+Tegalgondo,+Kec.+Karang+Ploso,+Kabupaten+Malang,+Jawa+Timur+65152/@-7.9302109,112.5944297,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x2e78810048aa2731:0x954fa836b2e3f0de!2m2!1d112.5964097!2d-7.9170422?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#A1A1A1] rounded-[10px] px-4 py-3 mb-5 inline-flex items-center gap-2 hover:border-[#2B5379] hover:bg-[#E8F6FF]/50 transition-all duration-300 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[#2B5379]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <p className="text-[14px] md:text-[16px] text-[#4B4B4B] font-medium">
                Malang, Jawa Timur
              </p>
            </a>

            {/* Divider */}
            <div className="h-[0.5px] bg-[#4B4B4B] w-full mb-5" />

            {/* Location Details */}
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#234463] mb-3">
              Location Details
            </h3>
            <p className="text-[14px] md:text-[16px] text-[#4B4B4B] leading-relaxed mb-5">
              Perumahan D&apos;Soeta Residence, Blk. D No.1, Babatan, Tegalgondo,
              Karang Ploso, Kabupaten Malang, Jawa Timur 65152.
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
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
  );
}
