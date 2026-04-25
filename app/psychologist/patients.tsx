"use client";

import { useState, useEffect } from "react";
import PatientStats from "@/app/components/features/psychologist/patients/patientstats";
import PatientsList from "@/app/components/features/psychologist/patients/patientslist";
import PatientDetailModal from "@/app/components/features/psychologist/patients/patientdetailmodal";
import { getAllPatients } from "@/lib/api/psychologist";
import type { PsychologistPatient, PatientsResponse } from "@/lib/types/psychologist";

export default function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [patientsData, setPatientsData] = useState<PatientsResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "lastSession" | "totalSessions">("name");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({
        search: searchTerm,
        sortBy: sortBy
      });
      setPatientsData(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, sortBy]);

  const handleViewDetails = (patient: PsychologistPatient) => {
    setSelectedPatientId(patient.id);
    setIsModalOpen(true);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleSortChange = (sort: "name" | "lastSession" | "totalSessions") => {
    setSortBy(sort);
  };

  if (loading && !patientsData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data pasien...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Pasien Saya</h1>
        <p className="text-gray-600 mt-1">Kelola dan lihat informasi pasien Anda</p>
      </div>

      {/* Stats */}
      {patientsData && (
        <PatientStats total={patientsData.total} />
      )}

      {/* Patients List */}
      {patientsData && (
        <PatientsList
          patients={patientsData.patients}
          onViewDetails={handleViewDetails}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          sortBy={sortBy}
        />
      )}

      {/* Patient Detail Modal */}
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
