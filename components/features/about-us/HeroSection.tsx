import Image from "next/image";
import StatCard from "@/components/ui/StatCard";

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

export default function HeroSection() {
  return (
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
          src="/assets/about-us/aboutus1.JPG"
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
                value="50+"
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
  );
}
