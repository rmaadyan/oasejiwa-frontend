import TeamMemberCard from "@/components/ui/TeamMemberCard";

const teamMembers = [
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Dr. Sarah Wijaya",
    role: "Founder",
    experience:
      "Psikolog klinis dengan pengalaman lebih dari 15 tahun dalam bidang kesehatan mental dan konseling.",
  },
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Dr. Budi Santoso",
    role: "Co-Founder",
    experience:
      "Ahli psikologi perkembangan dengan spesialisasi dalam terapi keluarga dan anak-anak.",
  },
  {
    imageSrc: "/assets/about-us/about-us.jpg",
    name: "Putri Rahayu, M.Psi",
    role: "Lead Psychologist",
    experience:
      "Spesialis dalam terapi kognitif-behavioral dengan fokus pada kecemasan dan depresi.",
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
