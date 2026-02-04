import Image from "next/image";

interface TeamMemberCardProps {
  imageSrc: string;
  name: string;
  role: string;
  experience: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export default function TeamMemberCard({
  imageSrc,
  name,
  role,
  experience,
  linkedinUrl = "#",
  instagramUrl = "#",
  facebookUrl = "#",
}: TeamMemberCardProps) {
  return (
    <div className="bg-[#E8F6FF] rounded-[22px] p-7 flex flex-col items-center w-full max-w-[426px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#E8F6FF] hover:to-[#d4edff] group">
      {/* Photo */}
      <div className="w-full aspect-[370/508] relative rounded-[20px] overflow-hidden mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className="text-[16px] md:text-[18px] font-semibold text-[#234463] mb-2 text-center font-[var(--font-poppins)]">
        {name}
      </h3>

      {/* Role */}
      <p className="text-[14px] md:text-[16px] font-semibold text-black mb-4 text-center font-[var(--font-poppins)]">
        {role}
      </p>

      {/* Experience */}
      <p className="text-[12px] md:text-[14px] font-medium text-[#4B4B4B] text-center mb-6 leading-relaxed font-[var(--font-poppins)]">
        {experience}
      </p>

      {/* Social Icons */}
      <div className="flex gap-4 mt-auto">
        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#234463] rounded-full flex items-center justify-center text-white hover:bg-[#2B5379] hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#234463] rounded-full flex items-center justify-center text-white hover:bg-[#2B5379] hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#234463] rounded-full flex items-center justify-center text-white hover:bg-[#2B5379] hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
