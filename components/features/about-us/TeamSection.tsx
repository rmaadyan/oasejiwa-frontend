import TeamMemberCard from "@/components/ui/TeamMemberCard";

const teamMembers = [
  {
    imageSrc: "/assets/about-us/founder.JPG",
    name: "Andi Zainuddin Japeri, M. Psi., Psikolog.",
    role: "CEO (Chief Executive Officer)",
    experience:
      "Berpraktik kurang dari 2 tahun di bidang psikologi klinis dengan fokus pada pelayanan yang profesional, empatik, dan berorientasi pada kebutuhan klien serta pengembangan layanan kesehatan mental.",
    linkedinUrl: "https://linkedin.com/in/andijaperi",
    instagramUrl: "https://www.instagram.com/AndiJaperi",
  },
  {
    imageSrc: "/assets/about-us/Bilqis.jpg",
    name: "Hana Bilqisty Rachmatillah Wahyu Putri, S. Psi",
    role: "CFO (Chief Financial Officer)",
    experience:
      "Bertanggung jawab atas pengelolaan keuangan, penyusunan anggaran, serta administrasi perusahaan untuk memastikan operasional berjalan secara efisien.",
    linkedinUrl: "https://linkedin.com/in/hanabilqisty",
    instagramUrl: "https://www.instagram.com/Hbrwp",
  },
  {
    imageSrc: "/assets/about-us/Novi.jpg",
    name: "Novi Rachmawati, S. Psi",
    role: "COO (Chief Operating Officer)",
    experience:
      "Bertanggung jawab mengelola operasional perusahaan, mengoordinasikan proses layanan, serta memastikan setiap layanan berjalan secara efektif, efisien, dan profesional.",
    linkedinUrl: "https://linkedin.com/in/novi-rahmawati-667480312",
    instagramUrl: "https://www.instagram.com/novrhma_",
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
              linkedinUrl={member.linkedinUrl}
              instagramUrl={member.instagramUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}