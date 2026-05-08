import TeamMemberCard from "@/components/ui/TeamMemberCard";

const teamMembers = [
  {
    imageSrc: "/assets/about-us/founder.JPG",
    name: "Andi Zainuddin Japeri, M. Psi., Psikolog.",
    role: "Founder",
    experience:
      "Psikolog klinis dengan pengalaman lebih dari 5 tahun dalam bidang kesehatan mental dan konseling.",
      instagramUrl: "https://www.instagram.com/andijaperi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    imageSrc: "/assets/about-us/bilqisty.png",
    name: "Hana Bilqisty",
    role: "Head of Internal Affairs & Quality",
    experience:
      "Mengatur standar kualitas internal dengan pendekatan psikologi lingkungan demi menjamin kenyamanan dan ketenangan setiap pengguna jasa.",
    instagramUrl:"https://www.instagram.com/hbrwp?igsh=MTZtY25laWcwbjRhaA==",  
  },
  {
    imageSrc: "/assets/about-us/Famila.png",
    name: "Famila",
    role: "Chief Operating Officier",
    experience:
      "Mahir dalam psikologi konsumen untuk memastikan komunikasi yang empatik, solutif, dan bebas stress selama proses booking.",
      instagramUrl:"https://www.instagram.com/famillaaj?igsh=MW00a2dmNGdxYXlpNA==",
  },
];

export default function TeamSection() {
  return (
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
              instagramUrl={member.instagramUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
