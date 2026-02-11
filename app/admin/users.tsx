"use client";

import { useState, useEffect } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import UserTable from "@/app/components/features/admin/users/usertable";
import UserModal from "@/app/components/features/admin/users/usermodal";
import UserDetailsModal from "@/app/components/features/admin/users/userdetailsmodal";
import UserFilterBar from "@/app/components/features/admin/users/userfilterbar";
import Pagination from "@/app/components/features/admin/users/pagination";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/users";
import { downloadToCSV } from "@/lib/utils/csv-export";
import type { User, UserFormData, SortOption, GenderFilter } from "@/lib/types/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Filter & Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: currentPage,
        perPage,
        sort: sortBy,
        gender: genderFilter,
        search: searchQuery
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, perPage, sortBy, genderFilter, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, sortBy, genderFilter, searchQuery]);

  // Handle create user
  const handleCreateUser = async (data: UserFormData) => {
    await createUser(data);
    await fetchUsers();
  };

  // Handle edit user
  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    await updateUser(selectedUser.id, data);
    await fetchUsers();
    setSelectedUser(null);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    await fetchUsers();
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Handle export to CSV
  const handleExport = () => {
    const exportData = users.map(user => ({
      ID: user.id,
      Nama: user.name,
      Email: user.email,
      'Jenis Kelamin': user.gender === 'male' ? 'Laki-laki' : 'Perempuan',
      Role: user.role === 'psychologist' ? 'Psikolog' : 'Pasien',
      Telepon: user.phone || '-',
      'Tanggal Bergabung': user.registeredAt || '-',
      Status: user.status === 'active' ? 'Aktif' : 'Nonaktif',
      'Total Booking': user.bookingCount || 0
    }));

    downloadToCSV(exportData, `users-${new Date().toISOString().split('T')[0]}.csv`); // ✅ Fixed: tambah .csv
  };

  // Open modals
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5379]">Manajemen User</h1>
          <p className="text-gray-600 mt-1">
            Kelola data user, tambah, edit, atau hapus user
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total User</p>
          <p className="text-3xl font-bold text-[#2B5379] mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Pasien</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {users.filter(u => u.role === "patient").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Psikolog</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {users.filter(u => u.role === "psychologist").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Halaman Ini</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        perPage={perPage}
        onPerPageChange={setPerPage}
        onExport={handleExport}
        totalUsers={totalUsers}
      />

      {/* User Table */}
      <UserTable
        users={users}
        onEdit={openEditModal}
        onViewDetails={openDetailsModal}
        loading={loading}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={modalMode === "create" ? handleCreateUser : handleEditUser}
        onDelete={modalMode === "edit" ? handleDeleteUser : undefined}
        user={selectedUser}
        mode={modalMode}
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id || null}
      />
    </div>
  );
}
