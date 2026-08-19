"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PatientStats from "@/components/features/psychologist/patients/patientstats";
import PatientsList from "@/components/features/psychologist/patients/patientslist";
import PatientDetailModal from "@/components/features/psychologist/patients/patientdetailmodal";
import CreatePatientModal from "@/components/features/psychologist/patients/createpatientmodal";
import { getAllPatients } from "@/lib/api/psychologist";
import type { PsychologistPatient } from "@/lib/types/psychologist";

export default function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [patientsList, setPatientsList] = useState<PsychologistPatient[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "lastSession" | "totalSessions">("name");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res: any = await getAllPatients({
        search: searchTerm,
        sortBy: sortBy,
        filter: "my_patients",
      });

      const extractedPatients = Array.isArray(res)
        ? res
        : Array.isArray(res?.patients)
        ? res.patients
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setPatientsList(extractedPatients);
      setTotalCount(res?.total ?? extractedPatients.length ?? 0);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatientsList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [sortBy, searchTerm]);

  const handleViewDetails = (patient: PsychologistPatient) => {
    setSelectedPatientId(patient.id);
    setIsModalOpen(true);
  };

  if (loading && patientsList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-poppins text-xs">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Memuat data pasien...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B5379]">Pasien Saya</h1>
          <p className="text-gray-600 mt-1 text-xs">Kelola dan lihat informasi pasien Anda</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatePatientOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B5379] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#234463] active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Pasien Baru
        </button>
      </div>

      {/* Stats Card */}
      <PatientStats total={totalCount} />

      {/* Daftar Pasien dengan Fitur Search Real-time */}
      <PatientsList
        patients={patientsList}
        onViewDetails={handleViewDetails}
        onSearchChange={(s) => setSearchTerm(s)}
        onSortChange={(s) => setSortBy(s)}
        sortBy={sortBy}
      />

      {/* Modal Detail Pasien */}
      <PatientDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatientId(null);
        }}
        patientId={selectedPatientId}
      />

      {/* Modal Tambah Pasien Baru */}
      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onSuccess={async () => {
          await fetchPatients();
        }}
      />
    </div>
  );
}