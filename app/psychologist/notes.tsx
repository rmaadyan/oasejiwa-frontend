"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import NotesList from "@/components/features/psychologist/notes/noteslist";
import NoteDetailModal from "@/components/features/psychologist/notes/notedetailmodal";
import CreateNoteModal from "@/components/features/psychologist/notes/createnotemodal";
import { deleteNote, getAllNotes } from "@/lib/api/psychologist";
import type { SessionNote } from "@/lib/types/psychologist";

export default function NotesPage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<SessionNote[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<
    "low" | "medium" | "high" | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "patient" | "riskLevel">(
    "date"
  );

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);

  const fetchNotes = async () => {
    setLoading(true);

    try {
      const data = await getAllNotes({
        search: searchTerm,
        riskLevel: riskFilter,
        sortBy,
      });

      setNotes(data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, riskFilter, sortBy]);

  const handleViewDetails = (note: SessionNote) => {
    setSelectedNote(note);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (note: SessionNote) => {
    setEditingNote(note);
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  const totalNotesCount = notes.length;
  const completedNotesCount = notes.filter((n) => Boolean(n.assessment)).length;
  const attentionNotesCount = notes.filter(
    (n) =>
      String(n.riskLevel).toLowerCase() === "high" ||
      String(n.riskLevel).toLowerCase() === "medium"
  ).length;

  return (
    <div className="space-y-6">
      {/* Title & Banner (Matching Rekam Medis) */}
      <div className="bg-gradient-to-r from-[#234463] to-[#2B5379] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Dokumentasi Rekam Medis Oase Jiwa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Catatan Sesi Konseling Digital
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Dokumentasi terstruktur keluhan utama, observasi psikolog, assessment, dan rencana intervensi.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingNote(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#F0F7FF] text-[#234463] hover:bg-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Catatan Sesi</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#2B5379] rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Catatan Sesi</p>
            <p className="text-2xl font-bold text-gray-900">{totalNotesCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Rekam Medis Lengkap</p>
            <p className="text-2xl font-bold text-gray-900">{completedNotesCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Perlu Perhatian Khusus</p>
            <p className="text-2xl font-bold text-gray-900">{attentionNotesCount}</p>
          </div>
        </div>
      </div>

      {loading && notes.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh] bg-white rounded-xl border border-gray-200">
          <div className="text-center p-8">
            <div className="w-10 h-10 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Memuat catatan sesi konseling...</p>
          </div>
        </div>
      ) : (
        <NotesList
          notes={notes}
          onViewDetails={handleViewDetails}
          onCreateNote={() => {
            setEditingNote(null);
            setIsCreateModalOpen(true);
          }}
          onSearchChange={setSearchTerm}
          onRiskFilterChange={setRiskFilter}
          onSortChange={setSortBy}
          riskFilter={riskFilter}
          sortBy={sortBy}
        />
      )}

      <NoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingNote(null);
        }}
        onSuccess={() => {
          fetchNotes();
          setIsCreateModalOpen(false);
          setEditingNote(null);
        }}
        editNote={editingNote}
      />
    </div>
  );
}