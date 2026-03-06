"use client";

import CreateNoteModal from "@/components/features/psychologist/notes/createnotemodal";
import NoteDetailModal from "@/components/features/psychologist/notes/notedetailmodal";
import NotesList from "@/components/features/psychologist/notes/noteslist";
import { deleteNote, getAllNotes } from "@/lib/api/psychologist";
import type { SessionNote } from "@/lib/types/psychologist";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<"low" | "medium" | "high" | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "patient" | "riskLevel">("date");

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getAllNotes({
        search: searchTerm,
        riskLevel: riskFilter, // Sekarang sudah sesuai dengan type
        sortBy: sortBy
      });
      setNotes(data.notes);
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

  const handleDelete = async (noteId: number) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat catatan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Catatan Konseling</h1>
        <p className="text-gray-600 mt-1">Kelola catatan sesi SOAP untuk pasien Anda</p>
      </div>

      {/* Notes List */}
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

      {/* Detail Modal */}
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

      {/* Create/Edit Modal */}
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
