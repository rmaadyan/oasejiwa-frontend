"use client";

import { useState, useEffect } from "react";
import PatientStats from "@/components/features/psychologist/patients/patientstats";
import PatientsList from "@/components/features/psychologist/patients/patientslist";
import PatientDetailModal from "@/components/features/psychologist/patients/patientdetailmodal";
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

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res: any = await getAllPatients({
        search: searchTerm,
        sortBy: sortBy,
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
  }, [sortBy, searchTerm]); // Trigger ulang API saat sorting berubah atau pencarian berubah

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
      <div>
        <h1 className="text-2xl font-bold text-[#2B5379]">Pasien Saya</h1>
        <p className="text-gray-600 mt-1 text-xs">Kelola dan lihat informasi pasien Anda</p>
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
    </div>
  );
}